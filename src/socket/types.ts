export interface MultipleSocket {
  start(port: number): Promise<void>;
  sendOne(id: string, data: Buffer): void;
  sendAll(data: Buffer): void;
  close(): void;
  onReceive(handler: (id: string, data: Buffer) => void): void;
  onConnect(handler: (id: string) => void): void;
  onDisconnect(handler: (id: string) => void): void;
}

export interface SingleSocket {
  connect(host: string, port: number): Promise<void>;
  close(): void;
  send(data: Buffer): boolean;
  onReceive(handler: (data: Buffer) => void): void;
  onDisconnect(handler: () => void): void;
}
