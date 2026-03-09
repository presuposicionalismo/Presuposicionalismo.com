/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Env = {
    VECTORIZE: import("@cloudflare/workers-types").VectorizeIndex;
    AI: import("@cloudflare/workers-types").Ai;
}

declare namespace App {
    interface Locals extends import("@astrojs/cloudflare").Runtime<Env> { }
}
