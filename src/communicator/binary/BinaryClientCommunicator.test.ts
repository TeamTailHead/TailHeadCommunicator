import { SocketClient } from "../../socket/types";
import BinaryClientCommunicator from "./BinaryClientCommunicator";

describe("BinaryClientCommunicator", () => {
  describe("send to sever", () => {
    test('should send "Join" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.send("join", { nickname: "aaa" });

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction).toBeCalledWith(
        Buffer.from([4, 0, 0, 0, 106, 111, 105, 110, 3, 0, 0, 0, 97, 97, 97]),
      );
    });

    test('should send "Exit" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.send("exit", {});

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction).toBeCalledWith(Buffer.from([4, 0, 0, 0, 101, 120, 105, 116]));
    });

    test('should send "StartGame" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.send("startGame", {});

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction).toBeCalledWith(Buffer.from([9, 0, 0, 0, 115, 116, 97, 114, 116, 71, 97, 109, 101]));
    });

    test('should send "SendChat" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.send("sendChat", { content: "bbbb" });

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction).toBeCalledWith(
        Buffer.from([8, 0, 0, 0, 115, 101, 110, 100, 67, 104, 97, 116, 4, 0, 0, 0, 98, 98, 98, 98]),
      );
    });
  });

  describe("receive from server", () => {
    test('should receive "LobbyInfo" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("lobbyInfo", (info) => {
        expect(info).toEqual<typeof info>({
          adminId: "aaa",
          players: [
            {
              id: "bbb",
              nickname: "ccc",
            },
            {
              id: "ddd",
              nickname: "eee",
            },
          ],
        });

        sendToClient(
          Buffer.from([
            9, 0, 0, 0, 108, 111, 98, 98, 121, 73, 110, 102, 111, 3, 0, 0, 0, 97, 97, 97, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0,
            0, 0, 98, 98, 98, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100, 3, 0, 0, 0, 101, 101, 101,
          ]),
        );
      });
    });

    test('should receive "gameTurnInfo" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("gameTurnInfo", (info) => {
        expect(info).toEqual<typeof info>({
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
          lastWord: "fff",
          deadline: new Date("2022-10-25T07:53:18.728Z"),
        });
      });

      sendToClient(
        Buffer.from([
          12, 0, 0, 0, 103, 97, 109, 101, 84, 117, 114, 110, 73, 110, 102, 111, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 97,
          97, 97, 3, 0, 0, 0, 98, 98, 98, 2, 0, 0, 0, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100, 3, 0, 0, 0, 3,
          0, 0, 0, 101, 101, 101, 3, 0, 0, 0, 102, 102, 102, 24, 0, 0, 0, 50, 48, 50, 50, 45, 49, 48, 45, 50, 53, 84,
          48, 55, 58, 53, 51, 58, 49, 56, 46, 55, 50, 56, 90,
        ]),
      );
    });

    test('should receive "playerChat" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("playerChat", (info) => {
        expect(info).toEqual<typeof info>({
          playerId: "aaa",
          nickname: "bbb",
          content: "ccc",
        });
      });

      sendToClient(
        Buffer.from([
          10, 0, 0, 0, 112, 108, 97, 121, 101, 114, 67, 104, 97, 116, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98, 3,
          0, 0, 0, 99, 99, 99,
        ]),
      );
    });

    test('should receive "systemChat" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("systemChat", (info) => {
        expect(info).toEqual<typeof info>({
          level: "info",
          content: "aaa",
        });
      });

      sendToClient(
        Buffer.from([10, 0, 0, 0, 115, 121, 115, 116, 101, 109, 67, 104, 97, 116, 0, 3, 0, 0, 0, 97, 97, 97]),
      );
    });

    test("should receive 'gameResult' message", () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("gameResult", (info) => {
        expect(info).toEqual<typeof info>({
          players: [
            {
              id: "aaa",
              nickname: "bbb",
              score: 1,
            },
            {
              id: "ccc",
              nickname: "ddd",
              score: 22,
            },
          ],
        });
      });

      sendToClient(
        Buffer.from([
          10, 0, 0, 0, 103, 97, 109, 101, 82, 101, 115, 117, 108, 116, 2, 0, 0, 0, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0,
          98, 98, 98, 1, 0, 0, 0, 3, 0, 0, 0, 99, 99, 99, 3, 0, 0, 0, 100, 100, 100, 22, 0, 0, 0,
        ]),
      );
    });

    test("should receive 'joinError' message", () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("joinError", (info) => {
        expect(info).toEqual<typeof info>({
          message: "joinError",
        });
      });

      sendToClient(
        Buffer.from([
          9, 0, 0, 0, 106, 111, 105, 110, 69, 114, 114, 111, 114, 9, 0, 0, 0, 106, 111, 105, 110, 69, 114, 114, 111,
          114,
        ]),
      );
    });

    test("should receive 'JoinInfo' message", () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new BinaryClientCommunicator(socketClient);

      client.onReceive("joinInfo", (info) => {
        expect(info).toEqual<typeof info>({
          playerId: "id1",
          nickname: "nickname2",
        });
      });

      sendToClient(
        Buffer.from([
          8, 0, 0, 0, 106, 111, 105, 110, 73, 110, 102, 111, 3, 0, 0, 0, 105, 100, 49, 9, 0, 0, 0, 110, 105, 99, 107,
          110, 97, 109, 101, 50,
        ]),
      );
    });
  });
});

function createMockSocketClient() {
  let receiveHandler: null | ((data: Buffer) => void) = null;

  const clientSenderFunction = jest.fn();

  const socketClient: SocketClient = {
    send: clientSenderFunction,
    onReceive(handler) {
      receiveHandler = handler;
    },
    onDisconnect() {
      // do nothing
    },
  };

  return {
    sendToClient(data: Buffer) {
      receiveHandler?.(data);
    },
    clientSenderFunction,
    socketClient,
  };
}
