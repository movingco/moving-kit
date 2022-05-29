// This file is a workaround for getting sha3_256 to work with ES modules properly.
import type { default as SHA3Type } from "js-sha3/index.d.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires
const sha3: typeof SHA3Type = require("js-sha3") as typeof SHA3Type;

export const { sha3_256 } = sha3;
