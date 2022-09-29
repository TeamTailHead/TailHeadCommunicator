import { connect } from "net";

import NodeMultipleSocket from "./NodeMultipleSocket";

const PORT = 5250;

describe("NodeMultipleSocket", () => {
  let server: NodeMultipleSocket;

  beforeEach(() => {
    server = new NodeMultipleSocket();
  });

  afterEach(() => {
    server.close();
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
        client.write("hello");
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
        client1.write("hello");
        client1.end();
        client1.destroy();
      });

      const client2 = connect({ port: PORT }, () => {
        client2.write("world");
        client2.end();
        client2.destroy();
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
          expect(data.toString()).toBe("hello");
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
            received.push(data.toString());

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

  // test("should receive by each chunk", (done) => {
  //   server.start(PORT).then(() => {
  //     const client = connect({ port: PORT }, () => {
  //       client.end();
  //       client.destroy();
  //     });
  //   });

  //   server.onConnect(() => {
  //     server.sendAll(Buffer.from("hello"));
  //     server.sendAll(Buffer.from("world"));
  //   });
  // });
});
