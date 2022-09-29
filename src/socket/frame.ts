export const BODY_SIZE_SLOT_LENGTH = 2;

export function buildFrame(buffer: Buffer) {
  const size = buffer.length;

  if (size >= 65535 - BODY_SIZE_SLOT_LENGTH) {
    throw new Error("Frame size is too big");
  }

  const frame = Buffer.alloc(size + BODY_SIZE_SLOT_LENGTH);

  frame.writeUInt16BE(size, 0);

  buffer.copy(frame, BODY_SIZE_SLOT_LENGTH);

  return frame;
}

export type FrameHandler = (frame: Buffer) => void;

export class FrameReader {
  private frameHandler: FrameHandler | undefined;
  private currentBuffer: Buffer;

  constructor() {
    this.currentBuffer = Buffer.alloc(0);
  }

  push(data: Buffer) {
    this.currentBuffer = Buffer.concat([this.currentBuffer, data]);

    this.process();
  }

  onFrame(handler: FrameHandler) {
    this.frameHandler = handler;
  }

  private process() {
    while (this.currentBuffer.length >= BODY_SIZE_SLOT_LENGTH) {
      const bodySize = this.currentBuffer.readUInt16BE(0);

      if (this.currentBuffer.length < bodySize + BODY_SIZE_SLOT_LENGTH) {
        break;
      }

      const frame = this.currentBuffer.subarray(BODY_SIZE_SLOT_LENGTH, bodySize + BODY_SIZE_SLOT_LENGTH);

      this.currentBuffer = this.currentBuffer.subarray(bodySize + BODY_SIZE_SLOT_LENGTH);

      this.frameHandler?.(frame);
    }
  }
}
