import { ClientMessage, ServerMessage } from "../message";

export interface ServerCommunicator {
  sendAll<K extends keyof ServerMessage>(type: K, data: ServerMessage[K]): void;
  sendOne<K extends keyof ServerMessage>(clientKey: string, type: K, data: ServerMessage[K]): void;
  onReceive<K extends keyof ClientMessage>(type: K, fn: ClientMessageHandler<ClientMessage[K]>): void;
}

export interface ClientCommunicator {
  send<K extends keyof ClientMessage>(type: K, data: ClientMessage[K]): void;
  onReceive<K extends keyof ServerMessage>(type: K, fn: ServerMessageHandler<ServerMessage[K]>): void;
}

export type ClientMessageHandler<Data> = (clientKey: string, data: Data) => void;
export type ServerMessageHandler<Data> = (data: Data) => void;
