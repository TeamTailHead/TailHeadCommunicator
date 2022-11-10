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

    test("send gameInfo to all", () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendAll("gameTurnInfo", {
        turnSequence: 1,
        players: [
          {
            id: "aaa",
            nickname: "bbb",
            score: 2,
          },
          {
            id: "ccc",
            nickname: "ddd",
            score: 3,
          },
        ],
        currentPlayerId: "eee",
        lastWord: "f",
        deadline: new Date("2022-10-25T07:53:18.728Z"),
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction).toBeCalledWith(
        Buffer.from([
          12, 0, 0, 0, 103, 97, 109, 101, 84, 117, 114, 110, 73, 110, 102, 111, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 97,
          97, 97, 3, 0, 0, 0, 98, 98, 98, 2, 0, 0, 0, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100, 3, 0, 0, 0, 3,
          0, 0, 0, 101, 101, 101, 1, 0, 0, 0, 102, 24, 0, 0, 0, 50, 48, 50, 50, 45, 49, 48, 45, 50, 53, 84, 48, 55, 58,
          53, 51, 58, 49, 56, 46, 55, 50, 56, 90,
        ]),
      );
    });

    test("send playerChat to all", () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendAll("playerChat", {
        playerId: "aaa",
        nickname: "bbb",
        content: "ccc",
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction).toBeCalledWith(
        Buffer.from([
          10, 0, 0, 0, 112, 108, 97, 121, 101, 114, 67, 104, 97, 116, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98, 3,
          0, 0, 0, 99, 99, 99,
        ]),
      );
    });

    test("send systemChat to all", () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendAll("systemChat", {
        level: "info",
        content: "aaa",
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction).toBeCalledWith(
        Buffer.from([10, 0, 0, 0, 115, 121, 115, 116, 101, 109, 67, 104, 97, 116, 0, 3, 0, 0, 0, 97, 97, 97]),
      );
    });

    test("send gameResult to all", () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendAll("gameResult", {
        players: [
          {
            id: "aaa",
            nickname: "bbb",
            score: 2,
          },
          {
            id: "ccc",
            nickname: "ddd",
            score: 3,
          },
        ],
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction).toBeCalledWith(
        Buffer.from([
          10, 0, 0, 0, 103, 97, 109, 101, 82, 101, 115, 117, 108, 116, 2, 0, 0, 0, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0,
          98, 98, 98, 2, 0, 0, 0, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100, 3, 0, 0, 0,
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

    test("send JoinInfo to one", () => {
      const { socketServer, serverSendOneFunction } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.sendOne("aaa", "joinInfo", { playerId: "aaa", nickname: "bbb" });

      expect(serverSendOneFunction).toBeCalledTimes(1);
      expect(serverSendOneFunction).toBeCalledWith(
        "aaa",
        Buffer.from([
          8, 0, 0, 0, 106, 111, 105, 110, 73, 110, 102, 111, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98,
        ]),
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

    test("recieve StartGame command", () => {
      const { socketServer, sendToServer } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.onReceive("startGame", (id) => {
        expect(id).toBe("aaa");
      });

      sendToServer("aaa", Buffer.from([10, 0, 0, 0, 115, 116, 97, 114, 116, 71, 97, 109, 101]));
    });

    test("recieve Exit command", () => {
      const { socketServer, sendToServer } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.onReceive("exit", (id) => {
        expect(id).toBe("aaa");
      });

      sendToServer("aaa", Buffer.from([4, 0, 0, 0, 101, 120, 105, 116]));
    });

    test("recieve sendChat command", () => {
      const { socketServer, sendToServer } = createMockSocketServer();
      const server = new BinaryServerCommunicator(socketServer);

      server.onReceive("sendChat", (id, data) => {
        expect(id).toBe("aaa");
        expect(data).toEqual({ content: "bbb" });
      });

      sendToServer("aaa", Buffer.from([8, 0, 0, 0, 115, 101, 110, 100, 67, 104, 97, 116, 3, 0, 0, 0, 98, 98, 98]));
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
