export interface LobbyInfo {
  players: Array<{
    id: string;
    nickname: string;
  }>;
  adminId: string;
}

export interface GameTurnInfo {
  turnSequence: number;
  players: Array<{
    id: string;
    nickname: string;
    score: number;
  }>;
  currentPlayerId: string;
  lastWord: string;
  deadline: Date;
}

export interface PlayerChat {
  playerId: string;
  nickname: string;
  content: string;
}

export interface SystemChat {
  level: "info" | "warning" | "error";
  content: string;
}

export interface GameResult {
  players: Array<{
    id: string;
    nickname: string;
    score: number;
  }>;
}

export interface JoinError {
  message: string;
}

export interface JoinInfo {
  playerId: string;
  nickname: string;
}

export interface ServerMessage {
  lobbyInfo: LobbyInfo;
  gameTurnInfo: GameTurnInfo;
  playerChat: PlayerChat;
  systemChat: SystemChat;
  gameResult: GameResult;
  joinError: JoinError;
  joinInfo: JoinInfo;
}
