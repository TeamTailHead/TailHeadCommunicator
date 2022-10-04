import { Socket } from "net";

import { buildFrame, FrameReader } from "./frame";
import { SocketClient } from "./types";

type ReceiveHandler = (data: Buffer) => void;
type ConnectHandler = () => void;
type DisconnectHandler = () => void;

export default class NodeSocketClient implements SocketClient {
  private socket: Socket;
  private reader: FrameReader;

  private receiveHandler: ReceiveHandler | undefined;
  private connectHandler: ConnectHandler | undefined;
  private disconnectHandler: DisconnectHandler | undefined;

  constructor() {
    this.socket = new Socket();

    this.socket.on("connect", () => {
      this.connectHandler?.();
    });

    this.socket.on("data", (data) => {
      this.reader.push(data);
    });

    this.socket.on("close", () => {
      this.disconnectHandler?.();
    });

    this.reader = new FrameReader();

    this.reader.onFrame((data) => {
      this.receiveHandler?.(data);
    });
  }

  connect(host: string, port: number): Promise<void> {
    return new Promise((resolve) => {
      this.socket.connect(
        {
          host,
          port,
        },
        resolve,
      );
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.end(resolve);
    });
  }

  send(data: Buffer): boolean {
    return this.socket.write(buildFrame(data));
  }

  onReceive(handler: (data: Buffer) => void): void {
    this.receiveHandler = handler;
  }

  onDisconnect(handler: () => void): void {
    this.disconnectHandler = handler;
  }
}
