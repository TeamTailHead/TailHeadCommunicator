import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { JoinInfo } from "../../message/serverMessage";

export const joinInfo = {
  encode(data: JoinInfo): Buffer {
    const writer = new BinaryWriter();
    const { playerId, nickname } = data;

    writer.writeString(playerId);
    writer.writeString(nickname);
    return writer.toBuffer();
  },
  decode(buffer: Buffer): JoinInfo {
    const reader = new BinaryReader(buffer);

    const playerId = reader.readString();
    const nickname = reader.readString();

    return {
      playerId: playerId,
      nickname: nickname,
    };
  },
};
