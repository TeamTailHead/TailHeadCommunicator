export interface StringBasedPacket<T = string> {
  type: T;
  data: unknown;
}
