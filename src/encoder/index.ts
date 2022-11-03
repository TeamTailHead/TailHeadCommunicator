import { exit } from "./clientencoder/exit";
import { join } from "./clientencoder/join";
import { sendChat } from "./clientencoder/sendChat";
import { startGame } from "./clientencoder/startGame";
import { lobbyInfo } from "./serverencoder/lobbyInfo";

export const clientEncoder = {
  join,
  startGame,
  exit,
  sendChat,
};

export const serverEncoder = {
  lobbyInfo,
};
