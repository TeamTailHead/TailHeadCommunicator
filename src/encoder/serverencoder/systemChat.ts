import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { SystemChat } from "../../message/serverMessage";

const levels: Array<SystemChat["level"]> = ["info", "error", "warning"];

export const systemChat = {
  encode(data: SystemChat): Buffer {
    const writer = new BinaryWriter();

    const { level, content } = data;

    const levelNo = levels.indexOf(level);

    writer.writeInt8(levelNo);
    writer.writeString(content);

    return writer.toBuffer();
  },
  decode(buffer: Buffer): SystemChat {
    const reader = new BinaryReader(buffer);

    const levelNo = reader.readInt8();
    const content = reader.readString();

    const level = levels[levelNo];

    return {
      level,
      content,
    };
  },
};
