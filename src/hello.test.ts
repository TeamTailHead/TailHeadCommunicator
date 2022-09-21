import { hello } from "./hello";

describe("hello", () => {
  test("success", () => {
    const result = hello(1, 2);
    expect(result).toBe(3);
  });
});
