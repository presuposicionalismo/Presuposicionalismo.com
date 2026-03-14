import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { env as workerEnv } from "cloudflare:workers";

interface IndexItem {
  id: string;
  title: string;
  description?: string;
  path: string;
  type: "blog" | "clase" | "libro";
}

const DEFAULT_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 25;

function toIndexItems(
  collection: Awaited<ReturnType<typeof getCollection>>,
  type: IndexItem["type"],
  basePath: string,
) {
  return collection.map((entry) => ({
    id: `${type}-${entry.id}`,
    title: entry.data.title,
    description: entry.data.description,
    path: `${basePath}/${entry.id}`,
    type,
  }));
}

export const GET: APIRoute = async ({ request }) => {
  if (!workerEnv?.AI || !workerEnv?.VECTORIZE) {
    return new Response(
      JSON.stringify({ error: "AI or VECTORIZE binding missing" }),
      { status: 500 },
    );
  }

  try {
    const url = new URL(request.url);
    const cursor = Math.max(
      Number.parseInt(url.searchParams.get("cursor") ?? "0", 10) || 0,
      0,
    );
    const requestedLimit =
      Number.parseInt(
        url.searchParams.get("limit") ?? `${DEFAULT_BATCH_SIZE}`,
        10,
      ) || DEFAULT_BATCH_SIZE;
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_BATCH_SIZE);

    const [blog, clases, libros] = await Promise.all([
      getCollection("blog"),
      getCollection("clases"),
      getCollection("libros"),
    ]);

    const allItems: IndexItem[] = [
      ...toIndexItems(blog, "blog", "/blog"),
      ...toIndexItems(clases, "clase", "/clases"),
      ...toIndexItems(libros, "libro", "/libros"),
    ];

    if (cursor >= allItems.length) {
      return new Response(
        JSON.stringify({
          success: true,
          indexed: 0,
          total: allItems.length,
          nextCursor: null,
          done: true,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const batch = allItems.slice(cursor, cursor + limit);
    let insertedCount = 0;

    for (const item of batch) {
      const textToEmbed = `${item.title}. ${item.description || ""}`;
      const embeddingResponse = await workerEnv.AI.run(
        "@cf/baai/bge-base-en-v1.5",
        {
          text: [textToEmbed],
        },
      );

      // @ts-ignore
      const values = embeddingResponse.data[0];

      await workerEnv.VECTORIZE.upsert([
        {
          id: item.id,
          values,
          metadata: {
            title: item.title,
            description: item.description || "",
            path: item.path,
            type: item.type,
          },
        },
      ]);

      insertedCount++;
    }

    const nextCursor = cursor + insertedCount;

    return new Response(
      JSON.stringify({
        success: true,
        indexed: insertedCount,
        total: allItems.length,
        nextCursor: nextCursor < allItems.length ? nextCursor : null,
        done: nextCursor >= allItems.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
