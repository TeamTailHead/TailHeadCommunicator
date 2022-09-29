import { nanoid } from "nanoid";
import { createServer, Server, Socket } from "net";

import { MultipleSocket } from "./types";

type DataReceiveCallback = (clientId: string, data: Buffer) => void;
type DisconnectCallback = (clientId: string) => void;
type ConnectCallback = (clientId: string) => void;

const noopFunction = () => {
  // do nothing
};

export default class NodeMultipleSocket implements MultipleSocket {
  private server: Server;
  private idToSocket = new Map<string, Socket>();

  private receiveHandler: DataReceiveCallback;
  private disconnectHandler: DisconnectCallback;
  private connectHandler: ConnectCallback;

  constructor() {
    this.receiveHandler = noopFunction;
    this.disconnectHandler = noopFunction;
    this.connectHandler = noopFunction;

    this.server = createServer();
    this.server.on("connection", (socket) => this.handleClientConnection(socket));
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, "localhost", resolve);
    });
  }

  sendAll(data: Buffer) {
    this.idToSocket.forEach((socket) => socket.write(data));
  }

  sendOne(id: string, data: Buffer) {
    const socket = this.idToSocket.get(id);
    if (socket) {
      socket.write(data);
    }
  }

  close(): void {
    this.server.close();
  }

  onReceive(handler: DataReceiveCallback): void {
    this.receiveHandler = handler;
  }

  onConnect(handler: ConnectCallback): void {
    this.connectHandler = handler;
  }

  onDisconnect(handler: DisconnectCallback): void {
    this.disconnectHandler = handler;
  }

  private handleClientConnection(socket: Socket) {
    const id = nanoid();
    this.idToSocket.set(id, socket);
    this.connectHandler(id);

    socket.on("data", (data) => {
      this.receiveHandler(id, data);
    });

    socket.on("close", () => {
      this.disconnectHandler(id);
      this.idToSocket.delete(id);
    });
  }
}
