type RngFn = (size: number) => Buffer;

// randomBytes which works for service workers
let randomBytesFn: RngFn;
if (typeof globalThis !== "undefined" && globalThis.crypto) {
  randomBytesFn = function (len: number) {
    const array = new Uint32Array(len);
    return Buffer.from(globalThis.crypto.getRandomValues(array));
  };
} else if (typeof window !== "undefined" && window.crypto) {
  randomBytesFn = function (len: number) {
    const array = new Uint32Array(len);
    return Buffer.from(window.crypto.getRandomValues(array));
  };
} else {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
  randomBytesFn = require("crypto").randomBytes;
}

export const randomBytes = randomBytesFn;
