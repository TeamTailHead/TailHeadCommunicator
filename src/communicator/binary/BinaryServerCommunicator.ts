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
import { SocketServer } from "../../socket/types";
import { ClientMessageHandler, ServerCommunicator } from "../types";

export default class BinaryServerCommunicator implements ServerCommunicator {
  private server: SocketServer;

  private handlers = new ClientMessageHandlerMap();

  constructor(socket: SocketServer) {
    this.server = socket;
    this.server.onReceive((clientId, data) => this.handleClientPacket(clientId, data));
  }

  sendAll<K extends keyof ServerMessage>(type: K, data: ServerMessage[K]): void {
    const writer = new BinaryWriter();
    writer.writeString(type);
    writer.writeBuffer(getEncodeData(type, data));

    const buffer = writer.toBuffer();
    this.server.sendAll(buffer);
  }

  sendOne<K extends keyof ServerMessage>(clientKey: string, type: K, data: ServerMessage[K]): void {
    const writer = new BinaryWriter();
    writer.writeString(type);
    writer.writeBuffer(getEncodeData(type, data));

    const buffer = writer.toBuffer();
    this.server.sendOne(clientKey, buffer);
  }

  onReceive<K extends keyof ClientMessage>(
    type: K,
    handler: (clientKey: string, data: ClientMessage[K]) => void,
  ): void {
    this.handlers.set(type, handler);
  }

  private handleClientPacket(clientId: string, incomingData: Buffer) {
    const reader = new BinaryReader(incomingData);
    const type: keyof ClientMessage = reader.readString() as keyof ClientMessage;
    const data = getDecodeData(incomingData);

    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`Invalid handler for type ${type}`);
    }

    handler(clientId, data as ClientMessage[keyof ClientMessage]);
  }
}

function getEncodeData<K extends keyof ServerMessage>(type: K, data: ServerMessage[K]): Buffer {
  switch (type) {
    case "lobbyInfo":
      return lobbyInfo.encode(data as ServerMessage["lobbyInfo"]);
    case "gameTurnInfo":
      return gameTurnInfo.encode(data as ServerMessage["gameTurnInfo"]);
    case "playerChat":
      return playerChat.encode(data as ServerMessage["playerChat"]);
    case "systemChat":
      return systemChat.encode(data as ServerMessage["systemChat"]);
    case "gameResult":
      return gameResult.encode(data as ServerMessage["gameResult"]);
    case "joinError":
      return joinError.encode(data as ServerMessage["joinError"]);
    case "joinInfo":
      return joinInfo.encode(data as ServerMessage["joinInfo"]);
    default:
      throw new Error(`Invalid type ${type}`);
  }
}

function getDecodeData(buffer: Buffer) {
  const reader = new BinaryReader(buffer);
  const type = reader.readString();
  const offsetIndex = reader.getOffset();

  const slicedBuffer = buffer.subarray(offsetIndex, buffer.length);

  switch (type) {
    case "join":
      return join.decode(slicedBuffer);
    case "startGame":
      return startGame.decode(slicedBuffer);
    case "exit":
      return exit.decode(slicedBuffer);
    case "sendChat":
      return sendChat.decode(slicedBuffer);
    default:
      throw new Error(`Invalid type ${type}`);
  }
}

class ClientMessageHandlerMap {
  private map: Map<keyof ClientMessage, ClientMessageHandler<unknown>>;
  constructor() {
    this.map = new Map();
  }

  set<K extends keyof ClientMessage>(type: K, handler: ClientMessageHandler<never>) {
    this.map.set(type, handler as ClientMessageHandler<unknown>);
  }

  get<K extends keyof ClientMessage>(type: K) {
    const handler = this.map.get(type);
    return (handler as ClientMessageHandler<ClientMessage[K]>) ?? null;
  }
}
