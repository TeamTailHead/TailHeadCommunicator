import { createServer, Server } from "net";

import { buildFrame } from "./frame";
import NodeSocketClient from "./NodeSocketClient";

const PORT = 5251;
const HOST = "localhost";

describe("NodeSingleSocket", () => {
  let server: Server;
  let client: NodeSocketClient;

  beforeEach((done) => {
    server = createServer();
    server.listen(PORT, "localhost", () => {
      done();
    });

    client = new NodeSocketClient();
  });

  afterEach((done) => {
    client.close().then(() => {
      server.close(done);
    });
  });

  test("should connect properly", (done) => {
    server.on("connection", () => {
      done();
    });

    client.connect(HOST, PORT);
  });

  test("should send data", (done) => {
    server.on("connection", (socket) => {
      socket.on("data", (data) => {
        done();
        expect(onlyFrameBody(data).toString()).toBe("hello");
      });

      client.send(Buffer.from("hello"));
    });

    client.connect(HOST, PORT);
  });

  test("should receive data", (done) => {
    server.on("connection", (socket) => {
      client.onReceive((data) => {
        done();
        expect(data.toString()).toBe("hello");
      });

      socket.write(buildFrame(Buffer.from("hello")));
    });

    client.connect(HOST, PORT);
  });

  test("should disconnect by server", (done) => {
    server.on("connection", (socket) => {
      socket.end();

      client.onDisconnect(() => {
        done();
      });
    });

    client.connect(HOST, PORT);
  });

  test("should disconnect by client", (done) => {
    server.on("connection", (socket) => {
      client.close();

      socket.on("close", () => {
        done();
      });
    });

    client.connect(HOST, PORT);
  });
});

function onlyFrameBody(data: Buffer) {
  return data.subarray(2);
}
