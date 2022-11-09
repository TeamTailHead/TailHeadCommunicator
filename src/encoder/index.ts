import { exit } from "./clientencoder/exit";
import { join } from "./clientencoder/join";
import { sendChat } from "./clientencoder/sendChat";
import { startGame } from "./clientencoder/startGame";
import { gameResult } from "./serverencoder/gameResult";
import { gameTurnInfo } from "./serverencoder/gameTurnInfo";
import { joinError } from "./serverencoder/joinError";
import { lobbyInfo } from "./serverencoder/lobbyInfo";
import { playerChat } from "./serverencoder/playerChat";
import { systemChat } from "./serverencoder/systemChat";

export const clientEncoder = {
  join,
  startGame,
  exit,
  sendChat,
};

export const serverEncoder = {
  lobbyInfo,
  gameResult,
  gameTurnInfo,
  playerChat,
  systemChat,
  joinError,
};
