// Valida src/data/knowledge.json contra el contenido real: esquema,
// referencias, fragmentos literales, anchors del HTML y artículos pendientes.
// Sale con código 1 si hay errores (las advertencias no fallan).
//
//   bun run knowledge:check     (requiere un `bun run build` previo)
import { readFileSync } from "node:fs";
import { knowledgeSchema } from "../../src/data/knowledge.schema";
import { KNOWLEDGE_PATH, loadArticles, loadEntityRefs, literalChecker } from "./lib";

const errors: string[] = [];
const warnings: string[] = [];

const raw = JSON.parse(readFileSync(KNOWLEDGE_PATH, "utf8"));
const parsed = knowledgeSchema.safeParse(raw);
if (!parsed.success) {
  for (const issue of parsed.error.issues)
    errors.push(`esquema ${issue.path.join(".")}: ${issue.message}`);
}
const k = raw;
const articles = new Map(loadArticles().map((a) => [a.ref, a]));
const entities = loadEntityRefs();
const isLiteral = literalChecker(articles);
const conceptIds = new Set(k.concepts.map((c: any) => c.id));

const refExists = (ref: string) =>
  ref.startsWith("concepto:")
    ? conceptIds.has(ref.slice("concepto:".length))
    : articles.has(ref) || entities.has(ref);

for (const e of k.edges) {
  for (const ref of [e.source, e.target]) {
    if (!refExists(ref))
      errors.push(`arista ${e.source} → ${e.target}: ${ref} no existe o no está publicado`);
  }
  if (e.evidence && articles.has(e.source) && !isLiteral(e.source, e.evidence)) {
    errors.push(`arista ${e.source} → ${e.target}: evidence no literal`);
  }
}

for (const q of k.queries) {
  const seen = new Set<string>();
  for (const r of q.results) {
    if (seen.has(r.ref))
      errors.push(`query ${q.id}: ${r.ref} repetido (rompe las claves del menú)`);
    seen.add(r.ref);
    const article = articles.get(r.ref);
    if (!article) {
      errors.push(`query ${q.id}: ${r.ref} no existe o no está publicado`);
      continue;
    }
    if (!isLiteral(r.ref, r.snippet)) errors.push(`query ${q.id} → ${r.ref}: snippet no literal`);
    if (r.anchor && !article.anchors.includes(r.anchor)) {
      errors.push(`query ${q.id} → ${r.ref}: anchor "${r.anchor}" no está en el HTML`);
    }
  }
}

for (const article of articles.values()) {
  const source = k.sources[article.ref];
  if (!source) warnings.push(`sin procesar: ${article.ref}`);
  else if (source.hash !== article.hash)
    warnings.push(`cambió desde que se procesó: ${article.ref}`);
}

for (const w of warnings) console.log(`aviso: ${w}`);
for (const e of errors) console.log(`ERROR: ${e}`);
console.log(
  `${k.concepts.length} conceptos · ${k.edges.length} aristas · ${k.queries.length} consultas · ` +
    `${Object.keys(k.sources).length}/${articles.size} artículos · ${errors.length} errores · ${warnings.length} avisos`,
);
if (warnings.length)
  console.log(
    "Para actualizar lo pendiente: bun run knowledge:prepare (ver scripts/knowledge/README.md).",
  );
process.exit(errors.length ? 1 : 0);
