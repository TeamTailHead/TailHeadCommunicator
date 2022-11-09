import { SocketServer } from "../../socket/types";
import BinaryServerCommunicator from "./BinaryServerCommunicator";

describe("BinaryServerCommunicator", () => {
  describe("sendAll", () => {
    test("send lobbyInfo to all", () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendAll("lobbyInfo", {
        adminId: "admin",
        players: [
          {
            id: "aaa",
            nickname: "bbb",
          },
          {
            id: "ccc",
            nickname: "ddd",
          },
        ],
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction).toBeCalledWith(
        Buffer.from([
          9, 0, 0, 0, 108, 111, 98, 98, 121, 73, 110, 102, 111, 5, 0, 0, 0, 97, 100, 109, 105, 110, 2, 0, 0, 0, 3, 0, 0,
          0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100,
        ]),
      );
    });
  });

  describe("sendOne", () => {
    test("send JoinError to one", () => {
      const { socketServer, serverSendOneFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendOne("aaa", "joinError", { message: "aaa" });

      expect(serverSendOneFunction).toBeCalledTimes(1);
      expect(serverSendOneFunction).toBeCalledWith(
        "aaa",
        Buffer.from([9, 0, 0, 0, 106, 111, 105, 110, 69, 114, 114, 111, 114, 3, 0, 0, 0, 97, 97, 97]),
      );
    });
  });

  describe("receive from client", () => {
    test("receive join command", () => {
      const { socketServer, sendToServer } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.onReceive("join", (id, data) => {
        expect(id).toBe("aaa");
        expect(data).toEqual({ nickname: "bbb" });
      });

      sendToServer("aaa", Buffer.from([4, 0, 0, 0, 106, 111, 105, 110, 3, 0, 0, 0, 98, 98, 98]));
    });
  });
});

function createMockSocketServer() {
  let receiveHandler: null | ((id: string, data: Buffer) => void) = null;

  const serverSendOneFunction = jest.fn();
  const serverSendAllFunction = jest.fn();

  const socketServer: SocketServer = {
    sendOne: serverSendOneFunction,
    sendAll: serverSendAllFunction,
    onReceive(handler) {
      receiveHandler = handler;
    },
    onConnect() {
      // do nothing
    },
    onDisconnect() {
      // do nothing
    },
  };

  return {
    sendToServer(clientId: string, data: Buffer) {
      receiveHandler?.(clientId, data);
    },
    serverSendOneFunction,
    serverSendAllFunction,
    socketServer,
  };
}
