import { JoinInfo } from "../../message/serverMessage";
import { joinInfo } from "./joinInfo";

describe("joinInfo", () => {
  describe("encode joinInfo method", () => {
    test("encode joinInfo", () => {
      const data: JoinInfo = {
        playerId: "aaa",
        nickname: "bbb",
      };

      const buffer = joinInfo.encode(data);

      expect(buffer).toEqual(Buffer.from([3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 98, 98, 98]));
    });
  });

  describe("decode joinInfo method", () => {
    test("decode joinInfo", () => {
      const data: JoinInfo = {
        playerId: "aaa",
        nickname: "bbb",
      };
      const buffer = joinInfo.encode(data);
      const decoded = joinInfo.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
