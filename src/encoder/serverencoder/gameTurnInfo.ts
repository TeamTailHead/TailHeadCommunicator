import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { GameTurnInfo } from "../../message/serverMessage";

export const gameTurnInfo = {
  encode(data: GameTurnInfo): Buffer {
    const writer = new BinaryWriter();

    const players = data.players;
    const playerCount = players.length;
    writer.writeInt32(data.turnSequence);

    writer.writeInt32(playerCount);
    players.forEach((player) => {
      writer.writeString(player.id);
      writer.writeString(player.nickname);
      writer.writeInt32(player.score);
    });

    writer.writeString(data.currentPlayerId);
    writer.writeString(data.lastWord);

    const deadline = data.deadline.toISOString();
    writer.writeString(deadline);

    return writer.toBuffer();
  },
  decode(buffer: Buffer): GameTurnInfo {
    const reader = new BinaryReader(buffer);

    const turnSequence = reader.readInt32();
    const playerCount = reader.readInt32();
    const players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: reader.readString(),
        nickname: reader.readString(),
        score: reader.readInt32(),
      });
    }
    const currentPlayerId = reader.readString();
    const lastWord = reader.readString();
    const deadline = new Date(reader.readString());

    return {
      turnSequence,
      players,
      currentPlayerId,
      lastWord,
      deadline,
    };
  },
};
