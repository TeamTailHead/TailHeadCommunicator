export default class BinaryReader {
  private buffer: Buffer;
  private offset: number;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  readInt8(): number {
    const value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  readInt16(): number {
    const value = this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  readInt32(): number {
    const value = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  readString(): string {
    const length = this.readInt32();
    const value = this.buffer.toString("utf-8", this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  getOffset(): number {
    return this.offset;
  }
}
