import { exit } from "./clientencoder/exit";
import { join } from "./clientencoder/join";
import { sendChat } from "./clientencoder/sendChat";
import { startGame } from "./clientencoder/startGame";
import { lobbyInfo } from "./lobbyInfo";

export const encoder = {
  join,
  startGame,
  exit,
  sendChat,
  lobbyInfo,
};
