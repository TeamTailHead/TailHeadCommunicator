import BinaryReader from "./BinaryReader";
import BinaryWriter from "./BinaryWriter";

describe("BinaryReadWrite", () => {
  test("should read and write single int8", () => {
    const writer = new BinaryWriter();
    writer.writeInt8(2);
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readInt8()).toBe(2);
  });

  test("should read and write three int8", () => {
    const writer = new BinaryWriter();
    writer.writeInt8(2);
    writer.writeInt8(3);
    writer.writeInt8(4);
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readInt8()).toBe(2);
    expect(reader.readInt8()).toBe(3);
    expect(reader.readInt8()).toBe(4);
  });

  test("should read and write single int16", () => {
    const writer = new BinaryWriter();
    writer.writeInt16(1234);
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readInt16()).toBe(1234);
  });

  test("should read and write single int32", () => {
    const writer = new BinaryWriter();
    writer.writeInt32(0x05040302);
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readInt32()).toBe(0x05040302);
  });

  test("should read and write single string", () => {
    const writer = new BinaryWriter();
    writer.writeString("hello");
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readString()).toBe("hello");
  });

  test("should read and write three string", () => {
    const writer = new BinaryWriter();
    writer.writeString("hello");
    writer.writeString("world");
    writer.writeString("electron!");
    const buffer = writer.toBuffer();
    const reader = new BinaryReader(buffer);
    expect(reader.readString()).toBe("hello");
    expect(reader.readString()).toBe("world");
    expect(reader.readString()).toBe("electron!");
  });
});
