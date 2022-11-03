import { GameTurnInfo } from "../../message/serverMessage";
import { gameTurnInfo } from "./gameTurnInfo";

describe("gameTurnInfo", () => {
  describe("encode gameTurnInfo method", () => {
    test("encode gameTurnInfo", () => {
      const deadline = new Date("2022-10-25T07:53:18.728Z");

      const data: GameTurnInfo = {
        turnSequence: 1,
        players: [
          {
            id: "asdf",
            nickname: "nickname",
            score: 111,
          },
          {
            id: "dagasf",
            nickname: "bbb",
            score: 222,
          },
        ],
        currentPlayerId: "id",
        lastWord: "이",
        deadline: deadline,
      };

      const buffer = gameTurnInfo.encode(data);

      expect(buffer).toEqual(
        Buffer.from([
          1, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 97, 115, 100, 102, 8, 0, 0, 0, 110, 105, 99, 107, 110, 97, 109, 101, 111,
          0, 0, 0, 6, 0, 0, 0, 100, 97, 103, 97, 115, 102, 3, 0, 0, 0, 98, 98, 98, 222, 0, 0, 0, 2, 0, 0, 0, 105, 100,
          3, 0, 0, 0, 236, 157, 180, 24, 0, 0, 0, 50, 48, 50, 50, 45, 49, 48, 45, 50, 53, 84, 48, 55, 58, 53, 51, 58,
          49, 56, 46, 55, 50, 56, 90,
        ]),
      );
    });
  });

  describe("decode gameTurnInfo method", () => {
    test("decode gameTurnInfo", () => {
      const deadline = new Date("2022-10-25T07:53:18.728Z");
      const data: GameTurnInfo = {
        turnSequence: 1,
        players: [
          {
            id: "asdf",
            nickname: "nickname",
            score: 111,
          },
          {
            id: "dagasf",
            nickname: "bbb",
            score: 222,
          },
        ],
        currentPlayerId: "id",
        lastWord: "이",
        deadline: deadline,
      };

      const buffer = gameTurnInfo.encode(data);
      const decoded = gameTurnInfo.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
