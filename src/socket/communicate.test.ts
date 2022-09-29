import NodeSocketClient from "./NodeSocketClient";
import NodeSocketServer from "./NodeSocketServer";

const PORT = 5250;

describe("Connection", () => {
  let server: NodeSocketServer;
  let client: NodeSocketClient;

  beforeEach(async () => {
    server = new NodeSocketServer();
    client = new NodeSocketClient();
    await server.start(PORT);
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  test("should send data from client", (done) => {
    server.onReceive((_, data) => {
      done();
      expect(data.toString()).toBe("hello world!");
    });

    client.connect("localhost", PORT).then(() => {
      client.send(Buffer.from("hello world!"));
    });
  });

  test("should send data from server", (done) => {
    client.onReceive((data) => {
      done();
      expect(data.toString()).toBe("hello world!");
    });

    server.onConnect(() => {
      server.sendAll(Buffer.from("hello world!"));
    });

    client.connect("localhost", PORT);
  });
});
