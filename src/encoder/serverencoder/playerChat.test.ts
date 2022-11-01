import { PlayerChat } from "../../message/serverMessage";
import { playerChat } from "./playerChat";

describe("playerChat", () => {
  describe("encode playerChat method", () => {
    test("encode playerChat", () => {
      const data: PlayerChat = {
        playerId: "aaa",
        nickname: "bbb",
        content: "ccc",
      };

      const buffer = playerChat.encode(data);
      expect(buffer).toEqual(Buffer.from([3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98, 3, 0, 0, 0, 99, 99, 99]));
    });
  });
  describe("decode playerChat method", () => {
    test("decode playerChat", () => {
      const data: PlayerChat = {
        playerId: "aaa",
        nickname: "bbb",
        content: "ccc",
      };

      const buffer = playerChat.encode(data);
      const decoded = playerChat.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
