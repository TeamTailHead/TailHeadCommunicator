import BinaryWriter from "./BinaryWriter";

describe("BinaryWriter", () => {
  test("should write single int8", () => {
    const wirter = new BinaryWriter();
    wirter.writeInt8(2);
    const buffer = wirter.toBuffer();
    expect(buffer.equals(Buffer.from([0x02]))).toBe(true);
  });

  test("should write three int8", () => {
    const writer = new BinaryWriter();
    writer.writeInt8(2);
    writer.writeInt8(3);
    writer.writeInt8(4);
    const buffer = writer.toBuffer();
    expect(buffer.equals(Buffer.from([0x02, 0x03, 0x04]))).toBe(true);
  });

  test("should write single int16", () => {
    const writer = new BinaryWriter();
    writer.writeInt16(0x0302);
    const buffer = writer.toBuffer();
    expect(buffer.equals(Buffer.from([0x02, 0x03]))).toBe(true);
  });

  test("should write single int32", () => {
    const writer = new BinaryWriter();
    writer.writeInt32(0x05040302);
    const buffer = writer.toBuffer();
    expect(buffer.equals(Buffer.from([0x02, 0x03, 0x04, 0x05]))).toBe(true);
  });

  test("should write single string", () => {
    const writer = new BinaryWriter();
    writer.writeString("aaaa");

    const buffer = writer.toBuffer();
    expect(buffer).toEqual(Buffer.from([4, 0, 0, 0, 97, 97, 97, 97]));
  });
});
