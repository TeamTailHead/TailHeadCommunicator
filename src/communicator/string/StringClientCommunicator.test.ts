import { SocketClient } from "../../socket/types";
import StringClientCommunicator from "./StringClientCommunicator";

// StringCommunicator 구현해둠 테스트만 작성하면 끝

describe("StringClientCommunicator", () => {
  describe("send to server", () => {
    test('should send "Join" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.send("join", { nickname: "nick" });

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction.mock.calls[0][0].toString("utf-8")).toEqual(
        '{"type":"join","data":{"nickname":"nick"}}',
      );
    });

    test('should send "Exit" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.send("exit", {});

      expect(clientSenderFunction).toBeCalledTimes(1);
    });

    test('should send "StartGame" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.send("startGame", {});

      expect(clientSenderFunction).toBeCalledTimes(1);
    });

    test('should send "SendChat" command', () => {
      const { socketClient, clientSenderFunction } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.send("sendChat", { content: "bbbb" });

      expect(clientSenderFunction).toBeCalledTimes(1);
      expect(clientSenderFunction.mock.calls[0][0].toString("utf-8")).toEqual(
        '{"type":"sendChat","data":{"content":"bbbb"}}',
      );
    });
  });

  describe("receive from server", () => {
    test('should send "Join" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.onReceive("lobbyInfo", (info) => {
        expect(info).toEqual<typeof info>({
          adminId: "mockId",
          players: [
            { id: "p1id", nickname: "p1name" },
            { id: "p2id", nickname: "p2name" },
          ],
        });
      });

      sendToClient(
        Buffer.from(
          JSON.stringify({
            type: "lobbyInfo",
            data: {
              adminId: "mockId",
              players: [
                { id: "p1id", nickname: "p1name" },
                { id: "p2id", nickname: "p2name" },
              ],
            },
          }),
        ),
      );
    });

    test('should send "SystemChat" command', () => {
      const { socketClient, sendToClient } = createMockSocketClient();
      const client = new StringClientCommunicator(socketClient);

      client.onReceive("systemChat", (info) => {
        expect(info).toEqual<typeof info>({
          level: "info",
          content: "asdf",
        });
      });

      sendToClient(
        Buffer.from(
          JSON.stringify({
            type: "systemChat",
            data: {
              level: "info",
              content: "asdf",
            },
          }),
        ),
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
