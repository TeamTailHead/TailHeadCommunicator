import { SocketServer } from "../../socket/types";
import StringServerCommunicator from "./StringServerCommunicator";

describe("StringServerCommunicator", () => {
  describe("send to client", () => {
    test('should send "LobbyInfo" command', () => {
      const { socketServer, serverSendAllFunction } = createMockSocketServer();
      const server = new StringServerCommunicator(socketServer);

      server.sendAll("lobbyInfo", {
        adminId: "admin",
        players: [
          {
            id: "p1id",
            nickname: "p1name",
          },
          {
            id: "p2id",
            nickname: "p2name",
          },
        ],
      });

      expect(serverSendAllFunction).toBeCalledTimes(1);
      expect(serverSendAllFunction.mock.calls[0][0].toString("utf-8")).toEqual(
        '{"type":"lobbyInfo","data":{"adminId":"admin","players":[{"id":"p1id","nickname":"p1name"},{"id":"p2id","nickname":"p2name"}]}}',
      );
    });
  });

  describe("receive from client", () => {
    test('should send "Join" command', () => {
      const { socketServer: socketClient, sendToServer } = createMockSocketServer();
      const server = new StringServerCommunicator(socketClient);

      server.onReceive("join", (_id, info) => {
        expect(info).toEqual<typeof info>({
          nickname: "player1",
        });
      });

      sendToServer(
        "id",
        Buffer.from(
          JSON.stringify({
            type: "join",
            data: {
              nickname: "player1",
            },
          }),
        ),
      );
    });

    test('should send "SendChat" command', () => {
      const { socketServer: socketClient, sendToServer } = createMockSocketServer();
      const server = new StringServerCommunicator(socketClient);

      server.onReceive("sendChat", (_id, info) => {
        expect(info).toEqual<typeof info>({
          content: "asdf",
        });
      });

      sendToServer(
        "id",
        Buffer.from(
          JSON.stringify({
            type: "sendChat",
            data: {
              content: "asdf",
            },
          }),
        ),
      );
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
