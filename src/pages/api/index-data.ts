import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ locals }) => {
    // @ts-ignore
    const env = locals.runtime?.env || locals.env;

    if (!env || !env.AI || !env.VECTORIZE) {
        return new Response(JSON.stringify({ error: "AI or VECTORIZE binding missing" }), { status: 500 });
    }

    try {
        // 1. Obtener todo el contenido
        const blog = await getCollection("blog");
        const clases = await getCollection("clases");
        const libros = await getCollection("libros");

        // 2. Mapear y aplanar todo a un array con el mismo formato
        const allItems = [
            ...blog.map(b => ({
                id: `blog-${b.id}`,
                title: b.data.title,
                description: b.data.description,
                path: `/blog/${b.id}`,
                type: "blog"
            })),
            ...clases.map(c => ({
                id: `clase-${c.id}`,
                title: c.data.title,
                description: c.data.description,
                path: `/clases/${c.id}`,
                type: "clase"
            })),
            ...libros.map(l => ({
                id: `libro-${l.id}`,
                title: l.data.title,
                description: l.data.description,
                path: `/libros/${l.id}`,
                type: "libro"
            }))
        ];

        let insertedCount = 0;

        // 3. Procesar embeddings e insertar en la BD
        // En un entorno de produccion masivo, esto se hace en batches (lotes).
        for (const item of allItems) {
            // Texto a vectorizar (idealmente titulo + descripcion + algo de body)
            const textToEmbed = `${item.title}. ${item.description || ""}`;

            const embeddingResponse = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
                text: [textToEmbed]
            });

            // @ts-ignore
            const values = embeddingResponse.data[0];

            // Upsert (inserta o actualiza)
            await env.VECTORIZE.upsert([
                {
                    id: item.id,
                    values: values,
                    metadata: {
                        title: item.title,
                        description: item.description || "",
                        path: item.path,
                        type: item.type
                    }
                }
            ]);

            insertedCount++;
            // Pequeno delay preventivo para no saturar APIs gratis
            await new Promise(r => setTimeout(r, 50));
        }

        return new Response(JSON.stringify({ success: true, indexed: insertedCount }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
