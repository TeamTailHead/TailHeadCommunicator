import BinaryReader from "./BinaryReader";

describe("BinaryReader", () => {
  test("should read single int8", () => {
    const data = Buffer.from([0x02]);

    const reader = new BinaryReader(data);

    expect(reader.readInt8()).toBe(2);
  });

  test("should read three int8", () => {
    const data = Buffer.from([0x02, 0x03, 0x04, 0x05]);

    const reader = new BinaryReader(data);

    expect(reader.readInt8()).toBe(2);
    expect(reader.readInt8()).toBe(3);
    expect(reader.readInt8()).toBe(4);
  });

  test("should read single int16", () => {
    const data = Buffer.from([0x02, 0x03, 0x04, 0x05]);

    const reader = new BinaryReader(data);

    expect(reader.readInt16()).toBe(0x0302);
  });

  test("should read single int32", () => {
    const data = Buffer.from([0x02, 0x03, 0x04, 0x05]);

    const reader = new BinaryReader(data);

    expect(reader.readInt32()).toBe(0x05040302);
  });

  test("should read single string", () => {
    const data = Buffer.from([4, 0, 0, 0, 97, 97, 97, 97]);

    const reader = new BinaryReader(data);

    expect(reader.readString()).toBe("aaaa");
  });
});
