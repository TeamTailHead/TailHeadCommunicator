import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { PlayerChat } from "../../message/serverMessage";

export const playerChat = {
  encode(data: PlayerChat): Buffer {
    const writer = new BinaryWriter();

    const { playerId, nickname, content } = data;
    writer.writeString(playerId);
    writer.writeString(nickname);
    writer.writeString(content);

    return writer.toBuffer();
  },
  decode(buffer: Buffer): PlayerChat {
    const reader = new BinaryReader(buffer);

    const playerId = reader.readString();
    const nickname = reader.readString();
    const content = reader.readString();

    return {
      playerId: playerId,
      nickname: nickname,
      content: content,
    };
  },
};
