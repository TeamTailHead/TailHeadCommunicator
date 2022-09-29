import { Socket } from "net";

import { SingleSocket } from "./types";

const noopFunction = () => {
  // do nothing
};

export default class NodeSingleSocket implements SingleSocket {
  socket: Socket;

  private receiveHandler: (data: Buffer) => void;
  private connectHandler: () => void;
  private disconnectHandler: () => void;

  constructor() {
    this.receiveHandler = noopFunction;
    this.connectHandler = noopFunction;
    this.disconnectHandler = noopFunction;

    this.socket = new Socket({});

    this.socket.on("connect", () => {
      this.connectHandler();
    });

    this.socket.on("data", (data) => {
      this.receiveHandler(data);
    });

    this.socket.on("close", () => {
      this.disconnectHandler();
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

  send(data: Buffer): boolean {
    return this.socket.write(data);
  }

  onReceive(handler: (data: Buffer) => void): void {
    this.receiveHandler = handler;
  }

  onDisconnect(handler: () => void): void {
    this.disconnectHandler = handler;
  }
}
