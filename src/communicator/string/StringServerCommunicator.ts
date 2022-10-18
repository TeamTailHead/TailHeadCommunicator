import { ClientMessage, ServerMessage } from "../../message";
import { SocketServer } from "../../socket/types";
import { ClientMessageHandler, ServerCommunicator } from "../types";
import { StringBasedPacket } from "./common";

export default class StringServerCommunicator implements ServerCommunicator {
  private server: SocketServer;

  private handlers = new ClientMessageHandlerMap();

  constructor(socket: SocketServer) {
    this.server = socket;
    this.server.onReceive((clientId, data) => this.handleClientPacket(clientId, data));
  }

  sendAll<K extends keyof ServerMessage>(type: K, data: ServerMessage[K]): void {
    const serialized = this.serializeData(type, data);

    this.server.sendAll(Buffer.from(serialized, "utf-8"));
  }

  sendOne<K extends keyof ServerMessage>(clientKey: string, type: K, data: ServerMessage[K]): void {
    const serialized = this.serializeData(type, data);

    this.server.sendOne(clientKey, Buffer.from(serialized, "utf-8"));
  }

  onReceive<K extends keyof ClientMessage>(
    type: K,
    handler: (clientKey: string, data: ClientMessage[K]) => void,
  ): void {
    this.handlers.set(type, handler);
  }

  private handleClientPacket(clientId: string, incomingData: Buffer) {
    const rawJson = incomingData.toString("utf-8");
    const { type, data } = JSON.parse(rawJson) as StringBasedPacket<keyof ClientMessage>;

    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`Invalid handler for type ${type}`);
    }

    handler(clientId, data as ClientMessage[keyof ClientMessage]);
  }

  private serializeData(type: keyof ServerMessage, data: unknown) {
    const packetData: StringBasedPacket = {
      type,
      data,
    };
    const packetString = JSON.stringify(packetData);
    return packetString;
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
