import { lobbyInfo } from "./lobbyInfo";

describe("lobbyInfo", () => {
  describe("encoder", () => {
    test("should encode empty player list", () => {
      const data = {
        adminId: "aaaa",
        players: [],
      };

      const buffer = lobbyInfo.encode(data);

      expect(buffer).toEqual(Buffer.from([4, 0, 0, 0, 97, 97, 97, 97, 0, 0, 0, 0]));
    });

    test("should encode 3 players list", () => {
      const buffer = lobbyInfo.encode({
        adminId: "aaaa",
        players: [
          { id: "bbb", nickname: "cc" },
          { id: "ddd", nickname: "ee" },
        ],
      });

      expect(buffer).toEqual(
        Buffer.concat([
          Buffer.from([4, 0, 0, 0, 97, 97, 97, 97]),
          Buffer.from([2, 0, 0, 0]),
          Buffer.from([3, 0, 0, 0, 98, 98, 98]),
          Buffer.from([2, 0, 0, 0, 99, 99]),
          Buffer.from([3, 0, 0, 0, 100, 100, 100]),
          Buffer.from([2, 0, 0, 0, 101, 101]),
        ]),
      );
    });
  });

  describe("encodeDecode", () => {
    test("should decode encoded", () => {
      const data = {
        adminId: "aaaa",
        players: [{ id: "bbb", nickname: "cc" }],
      };

      const buffer = lobbyInfo.encode(data);

      const decoded = lobbyInfo.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
