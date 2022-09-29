import NodeMultipleSocket from "./NodeMultipleSocket";
import NodeSingleSocket from "./NodeSingleSocket";

const PORT = 5250;

describe("Connection", () => {
  let server: NodeMultipleSocket;
  let client: NodeSingleSocket;

  beforeEach(() => {
    server = new NodeMultipleSocket();
    server.start(PORT);

    client = new NodeSingleSocket();
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
