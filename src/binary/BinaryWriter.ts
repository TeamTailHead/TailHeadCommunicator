export default class BinaryWriter {
  private offset: number;
  private buffers: Buffer[];

  constructor() {
    this.buffers = [];
    this.offset = 0;
  }

  writeInt8(value: number): void {
    const buffer = Buffer.alloc(1);
    buffer.writeInt8(value, 0);
    this.buffers.push(buffer);
  }

  writeInt16(value: number): void {
    const buffer = Buffer.alloc(2);
    buffer.writeInt16LE(value, 0);
    this.buffers.push(buffer);
  }

  writeInt32(value: number): void {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(value, 0);
    this.buffers.push(buffer);
  }

  writeString(value: string): void {
    const stringBuffer = Buffer.from(value, "utf-8");
    const length = stringBuffer.length;

    this.writeInt32(length);
    this.buffers.push(stringBuffer);
    this.offset += length;
  }

  toBuffer(): Buffer {
    let totalLength = 0;
    for (let i = 0; i < this.buffers.length; i++) {
      totalLength += this.buffers[i].length;
    }
    const buffer = Buffer.concat(this.buffers, totalLength);

    return buffer;
  }
}
