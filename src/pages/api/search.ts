import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (!q) {
        return new Response(JSON.stringify({ error: "Missing query parameter 'q'" }), { status: 400 });
    }

    // Obtenemos las bindings de Cloudflare (AI y Vectorize) a traves de locals
    // @ts-ignore
    const env = locals.runtime?.env || locals.env;

    if (!env || !env.AI || !env.VECTORIZE) {
        return new Response(JSON.stringify({
            error: "Cloudflare bindings are missing. Are you running under Cloudflare/Wrangler?",
            info: env
        }), { status: 500 });
    }

    try {
        // 1. Convertir la busqueda del usuario a un vector usando Workers AI (bge-base-en-v1.5 = 768 dimensions)
        const embeddingResponse = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
            text: [q]
        });

        // @ts-ignore
        const queryVector = embeddingResponse.data[0];

        // 2. Buscar vectores similares en el indice de Vectorize
        const matches = await env.VECTORIZE.query(queryVector, {
            topK: 5,
            returnValues: false, // No necesitamos los vectores en la respuesta
            returnMetadata: true // Necesitamos la data (title, url, etc)
        });

        return new Response(JSON.stringify({ results: matches.matches }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
