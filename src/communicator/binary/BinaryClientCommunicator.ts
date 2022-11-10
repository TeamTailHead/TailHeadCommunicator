import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { exit } from "../../encoder/clientencoder/exit";
import { join } from "../../encoder/clientencoder/join";
import { sendChat } from "../../encoder/clientencoder/sendChat";
import { startGame } from "../../encoder/clientencoder/startGame";
import { gameResult } from "../../encoder/serverencoder/gameResult";
import { gameTurnInfo } from "../../encoder/serverencoder/gameTurnInfo";
import { joinError } from "../../encoder/serverencoder/joinError";
import { joinInfo } from "../../encoder/serverencoder/joinInfo";
import { lobbyInfo } from "../../encoder/serverencoder/lobbyInfo";
import { playerChat } from "../../encoder/serverencoder/playerChat";
import { systemChat } from "../../encoder/serverencoder/systemChat";
import { ClientMessage, ServerMessage } from "../../message";
import { SocketClient } from "../../socket/types";
import { ClientCommunicator } from "../types";
import { ServerMessageHandler } from "../types";

export default class BinaryClientCommunicator implements ClientCommunicator {
  private socket: SocketClient;

  private handlers: ServerMessageHandlerMap;

  constructor(socket: SocketClient) {
    this.socket = socket;
    this.socket.onReceive((data) => this.handleServerPacket(data));

    this.handlers = new ServerMessageHandlerMap();
  }

  send<K extends keyof ClientMessage>(type: K, data: ClientMessage[K]): void {
    const writer = new BinaryWriter();
    writer.writeString(type);
    writer.writeBuffer(getEncodeData(type, data));

    const buffer = writer.toBuffer();
    this.socket.send(buffer);
  }

  onReceive<K extends keyof ServerMessage>(type: K, handler: ServerMessageHandler<ServerMessage[K]>): void {
    this.handlers.set(type, handler);
  }

  private handleServerPacket(incomingData: Buffer) {
    const reader = new BinaryReader(incomingData);
    const type: keyof ServerMessage = reader.readString() as keyof ServerMessage;

    const data = getDecodeData(incomingData);

    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`Invalid handler for type ${type}`);
    }
    handler(data as ServerMessage[keyof ServerMessage]);
  }
}

class ServerMessageHandlerMap {
  private map: Map<keyof ServerMessage, ServerMessageHandler<unknown>>;
  constructor() {
    this.map = new Map();
  }

  set<K extends keyof ServerMessage>(type: K, handler: ServerMessageHandler<never>) {
    this.map.set(type, handler as ServerMessageHandler<unknown>);
  }

  get<K extends keyof ServerMessage>(type: K) {
    const handler = this.map.get(type);
    return (handler as ServerMessageHandler<ServerMessage[K]>) ?? null;
  }
}

function getEncodeData<K extends keyof ClientMessage>(type: K, data: ClientMessage[K]) {
  if (type == "exit") {
    return exit.encode({});
  } else if (type == "join") {
    return join.encode(data as ClientMessage["join"]);
  } else if (type == "startGame") {
    return startGame.encode({});
  } else if (type == "sendChat") {
    return sendChat.encode(data as ClientMessage["sendChat"]);
  }
  throw new Error(`${type} 타입이 없어요?`);
}

function getDecodeData(buffer: Buffer) {
  const reader = new BinaryReader(buffer);
  const type = reader.readString();
  const offsetIndex = reader.getOffset();

  const slicedBuffer = buffer.subarray(offsetIndex, buffer.length);

  if (type == "lobbyInfo") {
    return lobbyInfo.decode(slicedBuffer);
  } else if (type == "gameTurnInfo") {
    return gameTurnInfo.decode(slicedBuffer);
  } else if (type == "playerChat") {
    return playerChat.decode(slicedBuffer);
  } else if (type == "systemChat") {
    return systemChat.decode(slicedBuffer);
  } else if (type == "gameResult") {
    return gameResult.decode(slicedBuffer);
  } else if (type == "joinError") {
    return joinError.decode(slicedBuffer);
  } else if (type == "joinInfo") {
    return joinInfo.decode(slicedBuffer);
  }
  throw new Error(`${type} 타입이 없어요?`);
}
