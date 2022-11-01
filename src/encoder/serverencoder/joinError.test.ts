import { JoinError } from "../../message/serverMessage";
import { joinError } from "./joinError";

describe("joinError", () => {
  describe("encode joinError method", () => {
    test("encode joinError", () => {
      const data: JoinError = {
        message: "error",
      };

      const buffer = joinError.encode(data);
      expect(buffer).toEqual(Buffer.from([5, 0, 0, 0, 101, 114, 114, 111, 114]));
    });
  });
  describe("decode joinError method", () => {
    test("decode joinError", () => {
      const data: JoinError = {
        message: "error",
      };

      const buffer = joinError.encode(data);
      const decoded = joinError.decode(buffer);
      expect(decoded).toEqual(data);
    });
  });
});
