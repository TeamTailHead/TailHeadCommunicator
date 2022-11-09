import { GameResult } from "../../message/serverMessage";
import { gameResult } from "./gameResult";

describe("gameResult", () => {
  describe("encode gameResult", () => {
    test("encode gameResult", () => {
      const data: GameResult = {
        players: [
          {
            id: "aaa",
            nickname: "aba",
            score: 111,
          },
          {
            id: "bbb",
            nickname: "bba",
            score: 222,
          },
        ],
      };

      const buffer = gameResult.encode(data);

      expect(buffer).toEqual(
        Buffer.from([
          2, 0, 0, 0, 3, 0, 0, 0, 97, 97, 97, 3, 0, 0, 0, 97, 98, 97, 111, 0, 0, 0, 3, 0, 0, 0, 98, 98, 98, 3, 0, 0, 0,
          98, 98, 97, 222, 0, 0, 0,
        ]),
      );
    });
  });

  describe("decode gameResult", () => {
    test("decode gameResult", () => {
      const data: GameResult = {
        players: [
          {
            id: "aaa",
            nickname: "aba",
            score: 111,
          },
          {
            id: "bbb",
            nickname: "bba",
            score: 222,
          },
        ],
      };
      const buffer = gameResult.encode(data);
      const decoded = gameResult.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
