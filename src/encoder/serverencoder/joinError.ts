import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { JoinError } from "../../message/serverMessage";

export const joinError = {
  encode(data: JoinError): Buffer {
    const writer = new BinaryWriter();

    const { message } = data;

    writer.writeString(message);
    return writer.toBuffer();
  },
  decode(buffer: Buffer): JoinError {
    const reader = new BinaryReader(buffer);

    const message = reader.readString();
    return {
      message: message,
    };
  },
};
