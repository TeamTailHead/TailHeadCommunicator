import { exit } from "./exit";

describe("exit", () => {
  describe("encode exit method", () => {
    test("exit method", () => {
      const buffer = exit.encode({});

      expect(buffer).toEqual(Buffer.from([]));
    });
  });

  describe("decode exit method", () => {
    test("exit method", () => {
      const buffer = exit.encode({});
      const decoded = exit.decode(buffer);

      expect(decoded).toEqual({});
    });
  });
});
