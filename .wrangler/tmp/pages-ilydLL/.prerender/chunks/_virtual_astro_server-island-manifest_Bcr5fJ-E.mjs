globalThis.process ??= {};
globalThis.process.env ??= {};
const serverIslandMap = new Map();

const serverIslandNameMap = new Map();

export { serverIslandMap, serverIslandNameMap };
