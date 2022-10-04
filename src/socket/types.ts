export interface SocketServer {
  sendOne(id: string, data: Buffer): void;
  sendAll(data: Buffer): void;
  onReceive(handler: (id: string, data: Buffer) => void): void;
  onConnect(handler: (id: string) => void): void;
  onDisconnect(handler: (id: string) => void): void;
}

export interface SocketClient {
  send(data: Buffer): boolean;
  onReceive(handler: (data: Buffer) => void): void;
  onDisconnect(handler: () => void): void;
}
