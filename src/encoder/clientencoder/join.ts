import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { Join } from "../../message/clientMessage";

export const join = {
  encode(data: Join): Buffer {
    const writer = new BinaryWriter();
    writer.writeString(data.nickname);
    return writer.toBuffer();
  },
  decode(buffer: Buffer): Join {
    const reader = new BinaryReader(buffer);
    const nickname = reader.readString();
    return { nickname };
  },
};
