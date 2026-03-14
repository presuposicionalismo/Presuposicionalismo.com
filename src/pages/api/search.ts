import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { env as workerEnv } from "cloudflare:workers";

type SearchItemType = "blog" | "clase" | "libro";

interface SearchItem {
  title: string;
  description: string;
  path: string;
  type: SearchItemType;
}

interface SearchResult extends SearchItem {
  score: number;
  source: "vector" | "fallback";
}

const DEFAULT_TOP_K = 6;
const MAX_TOP_K = 15;

function normalizeQuery(raw: string | null): string {
  return (raw ?? "").trim().replace(/\s+/g, " ");
}

function parseTopK(raw: string | null): number {
  const parsed = Number.parseInt(raw ?? `${DEFAULT_TOP_K}`, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_TOP_K;
  }

  return Math.min(Math.max(parsed, 1), MAX_TOP_K);
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function lexicalScore(
  item: SearchItem,
  query: string,
  tokens: string[],
): number {
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  const title = item.title.toLowerCase();

  let score = 0;

  if (title.includes(query)) {
    score += 18;
  }

  if (haystack.includes(query)) {
    score += 10;
  }

  for (const token of tokens) {
    if (token.length <= 1) {
      continue;
    }

    if (title.includes(token)) {
      score += 5;
    }

    if (haystack.includes(token)) {
      score += 2;
    }
  }

  return score;
}

async function runFallbackSearch(
  query: string,
  topK: number,
): Promise<SearchResult[]> {
  const [blog, clases, libros] = await Promise.all([
    getCollection("blog"),
    getCollection("clases"),
    getCollection("libros"),
  ]);

  const allItems: SearchItem[] = [
    ...blog.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? "",
      path: `/blog/${entry.id}`,
      type: "blog" as const,
    })),
    ...clases.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? "",
      path: `/clases/${entry.id}`,
      type: "clase" as const,
    })),
    ...libros.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? "",
      path: `/libros/${entry.id}`,
      type: "libro" as const,
    })),
  ];

  const lowerQuery = query.toLowerCase();
  const tokens = tokenize(query);

  return allItems
    .map((item) => ({
      ...item,
      score: lexicalScore(item, lowerQuery, tokens),
      source: "fallback" as const,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function normalizeVectorResults(matches: any[] | undefined): SearchResult[] {
  if (!Array.isArray(matches)) {
    return [];
  }

  const normalized: SearchResult[] = [];

  for (const match of matches) {
    const metadata = match?.metadata;
    if (!metadata) {
      continue;
    }

    const path = typeof metadata.path === "string" ? metadata.path : "";
    const title = typeof metadata.title === "string" ? metadata.title : "";

    if (!path || !title) {
      continue;
    }

    const typeFromMetadata = metadata.type;
    const type: SearchItemType =
      typeFromMetadata === "blog" ||
      typeFromMetadata === "clase" ||
      typeFromMetadata === "libro"
        ? typeFromMetadata
        : "blog";

    normalized.push({
      title,
      description:
        typeof metadata.description === "string" ? metadata.description : "",
      path,
      type,
      score: typeof match?.score === "number" ? match.score : 0,
      source: "vector",
    });
  }

  return normalized;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const q = normalizeQuery(url.searchParams.get("q"));
  const topK = parseTopK(url.searchParams.get("topK"));

  if (!q || q.length < 2) {
    return new Response(
      JSON.stringify({
        error:
          "El parámetro 'q' es obligatorio y debe tener al menos 2 caracteres.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const hasVectorBindings = Boolean(workerEnv?.AI && workerEnv?.VECTORIZE);

  let vectorResults: SearchResult[] = [];
  let vectorError: string | null = null;

  if (hasVectorBindings) {
    try {
      const embeddingResponse = await workerEnv.AI.run(
        "@cf/baai/bge-base-en-v1.5",
        {
          text: [q],
        },
      );

      // @ts-ignore
      const queryVector = embeddingResponse?.data?.[0];

      if (Array.isArray(queryVector) && queryVector.length > 0) {
        const matches = await workerEnv.VECTORIZE.query(queryVector, {
          topK,
          returnValues: false,
          returnMetadata: true,
        });

        vectorResults = normalizeVectorResults(matches?.matches);
      }
    } catch (error: any) {
      vectorError = error?.message ?? "Vector search failed";
    }
  }

  if (vectorResults.length > 0) {
    return new Response(
      JSON.stringify({
        query: q,
        source: "vector",
        total: vectorResults.length,
        results: vectorResults,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const fallbackResults = await runFallbackSearch(q, topK);

    return new Response(
      JSON.stringify({
        query: q,
        source: "fallback",
        total: fallbackResults.length,
        results: fallbackResults,
        ...(vectorError
          ? { warning: `Vector search unavailable: ${vectorError}` }
          : {}),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error?.message ?? "Search failed",
        ...(vectorError ? { vectorError } : {}),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
