import { ClientMessage, ServerMessage } from "../message";

export interface ServerCommunicator {
  sendAll<K extends keyof ServerMessage>(type: K, data: ServerMessage[K]): void;
  onReceive<K extends keyof ClientMessage>(type: K, fn: HandlerFunction<ClientMessage[K]>): void;
}

export type HandlerFunction<Data> = (clientKey: string, data: Data) => void;

////////

// function create():ServerCommunicator {

// }

// const com = create();
// com.sendAll('joinError', {

// })

// com.receive('join', (clientKey, data) => {

// })
// type X = ServerMessage['lobbyInfo']
