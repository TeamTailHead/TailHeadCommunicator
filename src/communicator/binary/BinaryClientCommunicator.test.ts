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

  //클라가 받는거니까 서버메세지를 받아야하지? -> 그러면 커뮤니케이터 getDecoded를 서버 메세지를 받는 걸로 고쳐야함.
  describe("receive from server", () => {
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
