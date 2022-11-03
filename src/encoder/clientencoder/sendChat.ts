import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { SendChat } from "../../message/clientMessage";

export const sendChat = {
  encode(data: SendChat): Buffer {
    const writer = new BinaryWriter();
    writer.writeString(data.content);
    return writer.toBuffer();
  },
  decode(buffer: Buffer): SendChat {
    const reader = new BinaryReader(buffer);
    const content = reader.readString();
    return { content };
  },
};
