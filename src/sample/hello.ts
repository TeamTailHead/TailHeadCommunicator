export function hello(a: number, b: number) {
  return a + b;
}

export function mySetImmediate(fn: () => unknown) {
  setTimeout(fn, 0);
}
