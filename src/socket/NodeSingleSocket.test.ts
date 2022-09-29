import { createServer, Server } from "net";

import { buildFrame } from "./frame";
import NodeSingleSocket from "./NodeSingleSocket";

const PORT = 5251;
const HOST = "localhost";

describe("NodeSingleSocket", () => {
  let server: Server;
  let client: NodeSingleSocket;

  beforeEach((done) => {
    server = createServer();
    server.listen(PORT, "localhost", () => {
      done();
    });

    client = new NodeSingleSocket();
  });

  afterEach(() => {
    server.close();
    client.close();
  });

  test("should connect properly", (done) => {
    client.connect(HOST, PORT).then(() => {
      server.on("connection", () => {
        done();
      });
    });
  });

  test("should send data", (done) => {
    client.connect(HOST, PORT).then(() => {
      server.on("connection", (socket) => {
        client.send(Buffer.from("hello"));

        socket.on("data", (data) => {
          done();
          expect(onlyFrameBody(data).toString()).toBe("hello");
        });
      });
    });
  });

  test("should receive data", (done) => {
    client.connect(HOST, PORT).then(() => {
      server.on("connection", (socket) => {
        socket.write(buildFrame(Buffer.from("hello")));

        client.onReceive((data) => {
          done();
          expect(data.toString()).toBe("hello");
        });
      });
    });
  });

  test("should disconnect by server", (done) => {
    client.connect(HOST, PORT).then(() => {
      server.on("connection", (socket) => {
        socket.end();

        client.onDisconnect(() => {
          done();
        });
      });
    });
  });

  test("should disconnect by client", (done) => {
    client.connect(HOST, PORT).then(() => {
      server.on("connection", (socket) => {
        client.close();

        socket.on("close", () => {
          done();
        });
      });
    });
  });
});

function onlyFrameBody(data: Buffer) {
  return data.subarray(2);
}
