import { startGame } from "./startGame";

describe("startGame", () => {
  describe("encode startGame method", () => {
    test("encod startGame", () => {
      const buffer = startGame.encode({});

      expect(buffer).toEqual(Buffer.from([]));
    });
  });

  describe("decode startGame method", () => {
    test("decode startGame", () => {
      const buffer = startGame.encode({});
      const decoded = startGame.decode(buffer);

      expect(decoded).toEqual({});
    });
  });
});
