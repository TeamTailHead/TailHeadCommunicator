import { sendChat } from "./sendChat";

describe("sendChat", () => {
  describe("encode sendChat method", () => {
    test("sendChat", () => {
      const data = {
        content: "message",
      };
      const buffer = sendChat.encode(data);

      expect(buffer).toEqual(Buffer.from([7, 0, 0, 0, 109, 101, 115, 115, 97, 103, 101]));
    });
  });

  describe("decode sendChat method", () => {
    test("sendChat", () => {
      const data = {
        content: "message",
      };

      const buffer = sendChat.encode(data);
      const decoded = sendChat.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
