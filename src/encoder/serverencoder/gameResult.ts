import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { GameResult } from "../../message/serverMessage";

export const gameResult = {
  encode(data: GameResult): Buffer {
    const writer = new BinaryWriter();

    const { players } = data;
    const playerCount = players.length;

    writer.writeInt32(playerCount);
    players.forEach((player) => {
      writer.writeString(player.id);
      writer.writeString(player.nickname);
      writer.writeInt32(player.score);
    });

    return writer.toBuffer();
  },
  decode(buffer: Buffer): GameResult {
    const reader = new BinaryReader(buffer);

    const players = [];

    const playerCount = reader.readInt32();
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: reader.readString(),
        nickname: reader.readString(),
        score: reader.readInt32(),
      });
    }

    return {
      players,
    };
  },
};
