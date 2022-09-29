import { buildFrame, FrameReader } from "./frame";

describe("frame", () => {
  describe("buildFrame", () => {
    test("should build frame", () => {
      const data = [0x12, 0x34, 0x56, 0x78];

      const frame = buildFrame(Buffer.from(data));

      expect(frame).toEqual(Buffer.from([0x00, 0x04, 0x12, 0x34, 0x56, 0x78]));
    });

    test("should throw error when size is too big", () => {
      const data = new Array(65536).fill(1);

      expect(() => buildFrame(Buffer.from(data))).toThrowError();
    });
  });

  describe("FrameReader", () => {
    let reader: FrameReader;

    beforeEach(() => {
      reader = new FrameReader();
    });

    test("should read frame", () => {
      const data = [0x12, 0x34, 0x56, 0x78];

      const frameHandler = jest.fn();
      reader.onFrame(frameHandler);

      reader.push(buildFrame(Buffer.from(data)));

      expect(frameHandler).toBeCalledWith(Buffer.from(data));
      expect(frameHandler).toBeCalledTimes(1);
    });

    test("should read multiple frames", () => {
      const data1 = [0x12, 0x34, 0x56, 0x78];
      const data2 = [0x78, 0x56, 0x34];

      const frameHandler = jest.fn();
      reader.onFrame(frameHandler);

      const concatedData = Buffer.concat([buildFrame(Buffer.from(data1)), buildFrame(Buffer.from(data2))]);
      reader.push(concatedData);

      expect(frameHandler).toBeCalledWith(Buffer.from(data1));
      expect(frameHandler).toBeCalledWith(Buffer.from(data2));
      expect(frameHandler).toBeCalledTimes(2);
    });

    test("should read incomplete data w/ valid size", () => {
      const data1 = [0x12, 0x34, 0x56, 0x78];
      const data2 = [0x78, 0x56, 0x34];

      const frameHandler = jest.fn();
      reader.onFrame(frameHandler);

      const frame1 = buildFrame(Buffer.from(data1));
      const frame2 = buildFrame(Buffer.from(data2));
      const constructedData = Buffer.concat([frame1, frame2.subarray(0, 3)]);

      reader.push(constructedData);

      expect(frameHandler).toBeCalledWith(Buffer.from(data1));
      expect(frameHandler).toBeCalledTimes(1);
    });

    test("should read incomplete data w/ invalid size", () => {
      const data1 = [0x12, 0x34, 0x56, 0x78];
      const data2 = [0x78, 0x56, 0x34];

      const frameHandler = jest.fn();
      reader.onFrame(frameHandler);

      const frame1 = buildFrame(Buffer.from(data1));
      const frame2 = buildFrame(Buffer.from(data2));
      const constructedData = Buffer.concat([frame1, frame2.subarray(0, 2)]);

      reader.push(constructedData);

      expect(frameHandler).toBeCalledWith(Buffer.from(data1));
      expect(frameHandler).toBeCalledTimes(1);
    });
  });
});
