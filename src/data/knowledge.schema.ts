import { z } from "astro/zod";

// Índice de conocimiento generado del lado del desarrollador (LLM +
// embeddings, ver scripts/). El sitio solo lee src/data/knowledge.json:
// de aquí salen las búsquedas precalculadas del menú Ctrl+K, los
// "artículos relacionados" y la vista /grafo. Los vectores de embeddings
// NO van aquí -- viven en una caché local del script.

// Referencia a un nodo: "<colección>:<id>". Para blog/libros/autores/clases
// el id es el mismo que devuelve getCollection(); para conceptos es el id
// de `concepts` en este mismo archivo.
export const nodeRef = z
  .string()
  .regex(/^(blog|libros|autores|clases|concepto):.+$/, "Referencia de nodo inválida");

// De dónde salió una arista o un resultado. "manual" gana siempre: el
// script no debe sobrescribir lo que se corrigió a mano.
const origin = z.enum(["llm", "embedding", "manual"]);

const concept = z.object({
  // kebab-case, ej. "argumento-trascendental".
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  label: z.string(),
  // Variantes que un lector podría escribir: siglas, grafías, errores
  // comunes ("TAG", "argumento transcendental").
  aliases: z.array(z.string()).default([]),
  // Una o dos frases; se muestra en el menú y en el panel del grafo.
  description: z.string(),
  // Slug de un tag existente del blog, si el concepto corresponde a uno.
  tag: z.string().optional(),
});

const edge = z.object({
  source: nodeRef,
  target: nodeRef,
  // trata:       contenido -> concepto
  // desarrolla:  profundiza o continúa la idea del destino
  // responde-a:  réplica a una objeción/posición del destino
  // critica:     argumenta en contra del destino
  // cita:        contenido -> autor/libro
  // relacionado: cercanía semántica sin relación más específica
  type: z.enum(["trata", "desarrolla", "responde-a", "critica", "cita", "relacionado"]),
  // 0–1. Para "relacionado" es la similitud; para el resto, la confianza.
  weight: z.number().min(0).max(1),
  origin,
  // Fragmento breve del origen que justifica la arista; sirve para
  // revisarla y como tooltip en el grafo.
  evidence: z.string().optional(),
  reviewed: z.boolean().default(false),
});

const queryResult = z.object({
  ref: nodeRef,
  // Id del encabezado dentro del artículo, para enlazar a la sección.
  anchor: z.string().optional(),
  // Fragmento que responde a la consulta (no el resumen genérico del post).
  snippet: z.string(),
  origin,
});

const query = z.object({
  id: z.string(),
  // Forma canónica que se muestra al lector.
  text: z.string(),
  // Otras formas de escribir lo mismo; el menú compara sin acentos ni
  // mayúsculas contra `text` + `aliases`.
  aliases: z.array(z.string()).default([]),
  concept: z.string().optional(),
  // Ya ordenados: el primero es el mejor resultado.
  results: z.array(queryResult).min(1),
});

// Estado de generación por contenido, para regenerar solo lo que cambió.
const source = z.object({
  // Hash del cuerpo + frontmatter en el momento de procesarlo.
  hash: z.string(),
  model: z.string(),
  processedAt: z.coerce.date(),
});

export const knowledgeSchema = z
  .object({
    version: z.literal(1),
    generatedAt: z.coerce.date(),
    concepts: z.array(concept),
    edges: z.array(edge),
    queries: z.array(query),
    // Clave: nodeRef del contenido procesado (ej. "blog:el-problema-de-los-universales").
    sources: z.record(nodeRef, source),
  })
  .superRefine((data, ctx) => {
    // Integridad interna: los conceptos referenciados deben existir. Las
    // referencias a colecciones de contenido se validan en el build, contra
    // getCollection().
    const conceptIds = new Set(data.concepts.map((c) => c.id));
    const check = (ref: string, path: (string | number)[]) => {
      if (ref.startsWith("concepto:") && !conceptIds.has(ref.slice("concepto:".length))) {
        ctx.addIssue({ code: "custom", message: `Concepto inexistente: ${ref}`, path });
      }
    };

    data.edges.forEach((e, i) => {
      check(e.source, ["edges", i, "source"]);
      check(e.target, ["edges", i, "target"]);
    });
    data.queries.forEach((q, i) => {
      if (q.concept && !conceptIds.has(q.concept)) {
        ctx.addIssue({
          code: "custom",
          message: `Concepto inexistente: ${q.concept}`,
          path: ["queries", i, "concept"],
        });
      }
      q.results.forEach((r, j) => check(r.ref, ["queries", i, "results", j, "ref"]));
    });
  });

export type Knowledge = z.infer<typeof knowledgeSchema>;
export type KnowledgeEdge = z.infer<typeof edge>;
export type KnowledgeQuery = z.infer<typeof query>;
export type KnowledgeConcept = z.infer<typeof concept>;
