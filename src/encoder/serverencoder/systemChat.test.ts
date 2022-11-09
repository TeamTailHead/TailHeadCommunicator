import { SystemChat } from "../../message/serverMessage";
import { systemChat } from "./systemChat";

describe("encode systemCaht", () => {
  describe("encode systemChat method", () => {
    test("encode systemChat", () => {
      const data: SystemChat = {
        level: "info",
        content: "correct info",
      };

      const buffer = systemChat.encode(data);
      expect(buffer).toEqual(Buffer.from([0, 12, 0, 0, 0, 99, 111, 114, 114, 101, 99, 116, 32, 105, 110, 102, 111]));
    });

    test("encode systemChat error", () => {
      const data: SystemChat = {
        level: "error",
        content: "error info",
      };
      const buffer = systemChat.encode(data);
      expect(buffer).toEqual(Buffer.from([1, 10, 0, 0, 0, 101, 114, 114, 111, 114, 32, 105, 110, 102, 111]));
    });
  });
  describe("decode systemChat method", () => {
    test("decode systemChat", () => {
      const data: SystemChat = {
        level: "info",
        content: "correct info",
      };

      const buffer = systemChat.encode(data);
      const decoded = systemChat.decode(buffer);
      expect(decoded).toEqual(data);
    });
  });
});
