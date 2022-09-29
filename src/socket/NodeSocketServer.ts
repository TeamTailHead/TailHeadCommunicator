import { nanoid } from "nanoid";
import { createServer, Server, Socket } from "net";

import { buildFrame, FrameReader } from "./frame";
import { SocketServer } from "./types";

type DataReceiveCallback = (clientId: string, data: Buffer) => void;
type DisconnectCallback = (clientId: string) => void;
type ConnectCallback = (clientId: string) => void;

export default class NodeSocketServer implements SocketServer {
  private server: Server;
  private idToSocket = new Map<string, Socket>();

  private receiveHandler: DataReceiveCallback | undefined;
  private disconnectHandler: DisconnectCallback | undefined;
  private connectHandler: ConnectCallback | undefined;

  constructor() {
    this.server = createServer();
    this.server.on("connection", (socket) => this.handleClientConnection(socket));
  }

  async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, "localhost", resolve);
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  sendAll(data: Buffer) {
    this.idToSocket.forEach((socket) => socket.write(buildFrame(data)));
  }

  sendOne(id: string, data: Buffer) {
    const socket = this.idToSocket.get(id);
    if (socket) {
      socket.write(buildFrame(data));
    }
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
    const frameReader = new FrameReader();

    this.idToSocket.set(id, socket);
    this.connectHandler?.(id);

    socket.on("data", (data) => {
      frameReader.push(data);
    });

    socket.on("close", () => {
      this.disconnectHandler?.(id);
      this.idToSocket.delete(id);
    });

    frameReader.onFrame((data) => {
      this.receiveHandler?.(id, data);
    });
  }
}
