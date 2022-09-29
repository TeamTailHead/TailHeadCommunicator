import { ServerCommunicator } from "../communicator/types";
import { ClientMessage, ServerMessage } from "../message";

export default class BinaryServerCommunicator implements ServerCommunicator {
  connect(_host: string, _port: string): void {
    throw new Error("Method not implemented.");
  }
  disconnect(): void {
    throw new Error("Method not implemented.");
  }
  sendAll<K extends keyof ServerMessage>(_type: K, _data: ServerMessage[K]): void {
    throw new Error("Method not implemented.");
  }
  onReceive<K extends keyof ClientMessage>(
    _type: K,
    _fn: (clientKey: string, callback: ClientMessage[K]) => void,
  ): void {
    throw new Error("Method not implemented.");
  }

  //메서드 작성
}
