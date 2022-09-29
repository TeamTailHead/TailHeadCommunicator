import NodeSocketClient from "./NodeSocketClient";
import NodeSocketServer from "./NodeSocketServer";

const PORT = 5250;

describe("Connection", () => {
  let server: NodeSocketServer;
  let client: NodeSocketClient;

  beforeEach(() => {
    server = new NodeSocketServer();
    server.start(PORT);

    client = new NodeSocketClient();
  });

  afterEach(() => {
    server.close();
    client.close();
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

    client.connect("localhost", PORT).then(() => {
      server.sendAll(Buffer.from("hello world!"));
    });
  });
});
