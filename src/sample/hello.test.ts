import { hello, mySetImmediate } from "./hello";

describe("hello", () => {
  test("success", () => {
    const result = hello(1, 2);
    expect(result).toBe(3);
  });
});

describe("mySetImmediate", () => {
  test("success", () => {
    const callback = jest.fn();

    mySetImmediate(callback);

    expect(callback.mock.results[0]).toBe(undefined);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith();
  });
});
