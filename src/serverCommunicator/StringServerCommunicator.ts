import { ClientMessage, ServerMessage } from "../message";
import MultipleSocket from "./MultipleSocket";
import { HandlerFunction, ServerCommunicator } from "./types";

export default class StringServerCommunicator implements ServerCommunicator {
  private socket: MultipleSocket;

  private handlers = new ClientMessageHandlerMap();

  constructor() {
    this.socket = new MultipleSocket((clientId, data) => this.handleClientPakcet(clientId, data));
  }

  //메서드 작성
  //K라는 타입을 받아서 ServerMessage에 있는 키값들 중 K에 해당하는 함수?를 호출하고, 그 인터페이스에 맞는 데이터를 받아서 data에 넣고, 그 data를 이용해서 로직을 작성한다.

  sendAll<K extends keyof ServerMessage>(type: K, _data: ServerMessage[K]): void {
    if (type === "gameResult") {
      //const x = data as ServerMessage['gameResult'];
    }

    //모든 연결된 소켓들에게 보내기
    this.socket.sendAll(Buffer.from([]));
  }

  //들어오는 요청들에 대한 처리? 메서드 만들기?
  onReceive<K extends keyof ClientMessage>(
    type: K,
    handler: (clientKey: string, data: ClientMessage[K]) => void,
  ): void {
    this.handlers.set(type, handler);
  }

  private handleClientPakcet(_clientId: string, _data: Buffer) {
    // const handler = this.handlers.get('join');
  }
}

class ClientMessageHandlerMap {
  private map: Map<keyof ClientMessage, HandlerFunction<unknown>>;
  constructor() {
    this.map = new Map();
  }

  set<K extends keyof ClientMessage>(type: K, handler: HandlerFunction<never>) {
    this.map.set(type, handler as HandlerFunction<unknown>);
  }

  get<K extends keyof ClientMessage>(type: K) {
    const handler = this.map.get(type);
    return (handler as HandlerFunction<ClientMessage[K]>) ?? null;
  }
}

////// 서버 코드 예시
/*
function createServer() {
  const com = new StringServerCommunicator();

  const players = new Map<string, {score: number}>();

  com.onReceive('join', (clientKey) => {
    players.set(clientKey, {score: 0});
    console.log("플레이어가 접속했습니다.");

    com.sendAll('lobbyInfo', {
        adminId: 'asdf',
        players: Array.from(players.keys()), // 걍 예시
    });
  })

  com.onReceive('exit', (clientKey) => {
    players.delete(clientKey);
    console.log("플레이어가 나갔습니다.")
  });

  
  while (true) {
    // 뭔갈 한다


  }
}
*/
