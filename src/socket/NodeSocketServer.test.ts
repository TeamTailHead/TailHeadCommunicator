import { connect } from "net";

import { buildFrame } from "./frame";
import NodeSocketServer from "./NodeSocketServer";

const PORT = 5252;

describe("NodeMultipleSocket", () => {
  let server: NodeSocketServer;

  beforeEach(() => {
    server = new NodeSocketServer();
  });

  afterEach(async () => {
    await server.close();
  });

  test("should start properly", async () => {
    await server.start(PORT);

    expect(server).toBeDefined();
  });

  test("should connect", (done) => {
    server.start(PORT).then(() => {
      const client = connect({ port: PORT }, () => {
        client.end();
        client.destroy();
      });
    });

    server.onConnect((id) => {
      done();
      expect(id).toBeDefined();
    });
  });

  test("should receive data from single client", (done) => {
    server.start(PORT).then(() => {
      const client = connect({ port: PORT }, () => {
        client.write(buildFrame(Buffer.from("hello")));
        client.end();
        client.destroy();
      });
    });

    server.onReceive((id, data) => {
      done();
      expect(id).toBeDefined();
      expect(data.toString()).toBe("hello");
    });
  });

  test("should receive data from multiple clients", (done) => {
    server.start(PORT).then(() => {
      const client1 = connect({ port: PORT }, () => {
        client1.write(buildFrame(Buffer.from("hello")));
        client1.end(() => {
          const client2 = connect({ port: PORT }, () => {
            client2.write(buildFrame(Buffer.from("world")));
            client2.end();
          });
        });
      });
    });

    const idAndData: Array<[string, string]> = [];

    server.onReceive((id, data) => {
      idAndData.push([id, data.toString()]);

      if (idAndData.length === 2) {
        done();
        expect(idAndData).toEqual([
          [expect.any(String), "hello"],
          [expect.any(String), "world"],
        ]);
      }
    });
  });

  test("should detect disconnect", (done) => {
    server.start(PORT).then(() => {
      const client = connect({ port: PORT }, () => {
        client.end();
        client.destroy();
      });
    });

    let savedId: string;

    server.onConnect((clientId) => {
      savedId = clientId;
    });

    server.onDisconnect((id) => {
      done();
      expect(id).toBe(savedId);
    });
  });

  test("should send data to single client", (done) => {
    server.start(PORT).then(() => {
      const client = connect({ port: PORT }, () => {
        client.on("data", (data) => {
          client.destroy();
          done();
          expect(data.subarray(2).toString()).toBe("hello");
        });
      });
    });

    server.onConnect((id) => {
      server.sendOne(id, Buffer.from("hello"));
    });
  });

  test("should send data to all clients", (done) => {
    const socketCount = 3;
    const received: string[] = [];

    server.start(PORT).then(() => {
      [...new Array(socketCount)].forEach(() => {
        const client = connect({ port: PORT }, () => {
          client.on("data", (data) => {
            client.destroy();
            received.push(data.subarray(2).toString());

            if (received.length === socketCount) {
              done();

              expect(received).toEqual(["hello", "hello", "hello"]);
            }
          });
        });
      });
    });

    let connectionCount = 0;

    server.onConnect(() => {
      connectionCount++;
      if (connectionCount === socketCount) {
        server.sendAll(Buffer.from("hello"));
      }
    });
  });

  test("should receive by frame", (done) => {
    server.start(PORT).then(() => {
      const client = connect({ port: PORT }, () => {
        client.write(Buffer.concat([buildFrame(Buffer.from("hello")), buildFrame(Buffer.from("world"))]));

        client.end();
        client.destroy();
      });
    });

    const received: string[] = [];

    server.onReceive((_id, data) => {
      received.push(data.toString());

      if (received.length === 2) {
        done();
        expect(received).toEqual(["hello", "world"]);
      }
    });
  });
});
