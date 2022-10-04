import { ClientMessage, ServerMessage } from "../../message";
import { SocketClient } from "../../socket/types";
import { ClientCommunicator, ServerMessageHandler } from "../types";
import { StringBasedPacket } from "./common";

export default class StringClientCommunicator implements ClientCommunicator {
  private socket: SocketClient;

  private handlers: ServerMessageHandlerMap;

  constructor(socket: SocketClient) {
    this.socket = socket;
    this.socket.onReceive((data) => this.handleServerPacket(data));

    this.handlers = new ServerMessageHandlerMap();
  }

  send<K extends keyof ClientMessage>(type: K, data: ClientMessage[K]): void {
    this.socket.send(Buffer.from(JSON.stringify({ type, data }), "utf-8"));
  }

  onReceive<K extends keyof ServerMessage>(type: K, handler: ServerMessageHandler<ServerMessage[K]>): void {
    this.handlers.set(type, handler);
  }

  private handleServerPacket(incomingData: Buffer) {
    const rawJson = incomingData.toString("utf-8");
    const { type, data } = JSON.parse(rawJson) as StringBasedPacket<keyof ServerMessage>;

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
