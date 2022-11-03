import { join } from "./join";

describe("join", () => {
  describe("encoder", () => {
    test("should encode single player", () => {
      const data = {
        nickname: "abc",
      };

      const buffer = join.encode(data);

      expect(buffer).toEqual(Buffer.from([3, 0, 0, 0, 97, 98, 99]));
    });
  });

  describe("decoder", () => {
    test("should decode single player", () => {
      const data = {
        nickname: "abc",
      };

      const buffer = join.encode(data);
      const decoded = join.decode(buffer);

      expect(decoded).toEqual(data);
    });
  });
});
