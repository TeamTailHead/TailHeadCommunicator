import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { SystemChat } from "../../message/serverMessage";

export const systemChat = {
  encode(data: SystemChat): Buffer {
    const writer = new BinaryWriter();

    const { level, content } = data;

    let levelNo;
    if (level == "info") levelNo = 1;
    else if (level == "warning") levelNo = 2;
    else levelNo = 3;

    writer.writeInt8(levelNo);
    writer.writeString(content);

    return writer.toBuffer();
  },
  decode(buffer: Buffer): SystemChat {
    const reader = new BinaryReader(buffer);

    const levelNo = reader.readInt8();
    const content = reader.readString();

    let level: SystemChat["level"];
    if (levelNo == 1) level = "info";
    else if (levelNo == 2) level = "warning";
    else level = "error";

    return {
      level,
      content,
    };
  },
};
