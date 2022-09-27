export interface Join {
  nickname: string;
}
export type StartGame = Record<string, never>;
export type Exit = Record<string, never>;

export interface SendChat {
  content: string;
}

export interface ClientMessage {
  join: Join;
  startGame: StartGame;
  exit: Exit;
  sendChat: SendChat;
}
