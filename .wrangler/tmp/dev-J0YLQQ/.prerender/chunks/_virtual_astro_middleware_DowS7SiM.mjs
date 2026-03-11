globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sequence } from "./prerender_B1P4n268.mjs";

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env,
    };
  }
  return next();
};

const onRequest = sequence(onRequest$1);

export { onRequest };
