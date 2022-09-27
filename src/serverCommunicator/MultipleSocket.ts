import { nanoid } from "nanoid";
import { createServer, Server, Socket } from "net";

type DataReceiveCallback = (clientId: string, data: Buffer) => void;

export default class MultipleSocket {
  private server: Server;
  private idToSocket = new Map<string, Socket>();

  private receiveFn: DataReceiveCallback;

  constructor(onReceive: DataReceiveCallback) {
    this.receiveFn = onReceive;

    this.server = createServer((socket) => this.handleClientConnection(socket));

    this.server.listen(3000, () => {
      console.log("server started");
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

  private handleClientConnection(socket: Socket) {
    const id = nanoid();

    socket.on("ready", () => {
      this.idToSocket.set(id, socket);
    });

    socket.on("data", (data) => {
      this.receiveFn(id, data);
    });

    socket.on("close", () => {
      this.idToSocket.delete(id);
    });
  }
}
