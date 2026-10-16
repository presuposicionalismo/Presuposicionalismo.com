import { getCollection } from "astro:content";
import knowledgeJson from "../data/knowledge.json";
import { knowledgeSchema, type KnowledgeConcept } from "../data/knowledge.schema";
import postFilter from "./postFilter";
import { slugifyStr } from "./slugify";

// Datos de /conceptos: el índice de conocimiento resuelto contra los posts
// publicados. Una arista o pregunta que apunta a un borrador se descarta.

export interface ConceptArticle {
  title: string;
  url: string;
  pubDate: Date;
  // Fragmento literal del artículo que justifica que trate el concepto.
  evidence?: string;
  weight: number;
}

export interface ConceptQuestion {
  text: string;
  snippet: string;
  url: string;
}

export interface ConceptPage extends KnowledgeConcept {
  articles: ConceptArticle[];
  questions: ConceptQuestion[];
  // Conceptos que comparten artículos con este, de más a menos.
  related: { id: string; label: string; shared: number }[];
}

export async function getConcepts(): Promise<ConceptPage[]> {
  const knowledge = knowledgeSchema.parse(knowledgeJson);
  const posts = new Map(
    (await getCollection("blog", postFilter)).map((post) => [
      `blog:${post.id}`,
      {
        title: post.data.title,
        url: `/blog/${slugifyStr(post.data.title)}/`,
        pubDate: post.data.pubDate,
      },
    ]),
  );

  const articlesOf = new Map<string, ConceptArticle[]>();
  for (const edge of knowledge.edges) {
    if (edge.type !== "trata" || !edge.target.startsWith("concepto:")) continue;
    const post = posts.get(edge.source);
    if (!post) continue;
    const id = edge.target.slice("concepto:".length);
    const list = articlesOf.get(id) ?? [];
    list.push({ ...post, evidence: edge.evidence, weight: edge.weight });
    articlesOf.set(id, list);
  }

  const labels = new Map(knowledge.concepts.map((c) => [c.id, c.label]));
  const concepts = knowledge.concepts.map((concept) => {
    const articles = (articlesOf.get(concept.id) ?? []).sort(
      (a, b) => b.weight - a.weight || b.pubDate.valueOf() - a.pubDate.valueOf(),
    );
    const urls = new Set(articles.map((a) => a.url));

    const questions = knowledge.queries
      .filter((q) => q.concept === concept.id)
      .flatMap((q) =>
        q.results.slice(0, 1).flatMap((r) => {
          const post = posts.get(r.ref);
          if (!post) return [];
          return [
            {
              text: q.text,
              snippet: r.snippet,
              url: r.anchor ? `${post.url}#${r.anchor}` : post.url,
            },
          ];
        }),
      );

    const related = knowledge.concepts
      .filter((other) => other.id !== concept.id)
      .map((other) => ({
        id: other.id,
        label: labels.get(other.id)!,
        shared: (articlesOf.get(other.id) ?? []).filter((a) => urls.has(a.url)).length,
      }))
      .filter((r) => r.shared > 0)
      .sort((a, b) => b.shared - a.shared || a.label.localeCompare(b.label, "es"))
      .slice(0, 8);

    return { ...concept, articles, questions, related };
  });

  // Un concepto sin ningún artículo publicado no tiene página que mostrar.
  return concepts.filter((c) => c.articles.length > 0);
}
