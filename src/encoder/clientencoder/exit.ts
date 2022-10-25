import { Exit } from "../../message/clientMessage";

export const exit = {
  encode(_data: Exit): Buffer {
    return Buffer.from([]);
  },
  decode(_buffer: Buffer): Exit {
    return {};
  },
};
