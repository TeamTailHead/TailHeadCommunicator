import { StartGame } from "../../message/clientMessage";

export const startGame = {
  encode(_data: StartGame): Buffer {
    return Buffer.from([]);
  },
  decode(_buffer: Buffer): StartGame {
    return {};
  },
};
