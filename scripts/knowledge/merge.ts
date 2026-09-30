// Une los lotes (.work/batch-*.json) con src/data/knowledge.json. Todo lo que
// no valida contra el contenido real se descarta y queda en
// .work/merge-report.txt. Sin --write solo informa.
//
//   bun run knowledge:merge            simulación
//   bun run knowledge:merge --write    escribe knowledge.json
//
// Es idempotente: re-ejecutarlo con los mismos lotes da el mismo resultado.
// Lo que tenga `origin: "manual"` nunca se reemplaza ni se borra.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { knowledgeSchema } from "../../src/data/knowledge.schema";
import { KNOWLEDGE_PATH, WORK, loadArticles, loadEntityRefs, literalChecker, today } from "./lib";

// Vocabulario de conceptos que se propone a los lotes (ver SPEC.md): id ->
// [etiqueta, tag del blog]. Se crean solo si algún lote los usa y les da
// descripción.
const SEEDS: Record<string, [string, string?]> = {
  cosmovision: ["Cosmovisión", "cosmovision"],
  universales: ["El problema de los universales", "universales"],
  logica: ["Fundamento de la lógica", "logica"],
  "absolutos-morales": ["Absolutos morales y ética", "etica"],
  "problema-del-mal": ["Problema del mal"],
  escolasticismo: ["Escolasticismo y tomismo", "escolasticismo"],
  "teologia-natural": ["Teología natural y luz de la naturaleza", "teologia-natural"],
  revelacion: ["Revelación general y especial", "revelacion"],
  "ciencia-y-fe": ["Ciencia y fe", "ciencia"],
  creacion: ["Creación", "creacion"],
  naturalismo: ["Naturalismo", "naturalismo"],
  providencia: ["Providencia y soberanía de Dios", "providencia"],
  milagros: ["Milagros"],
  "lenguaje-religioso": ["Lenguaje religioso", "lenguaje-religioso"],
  "liberalismo-teologico": ["Liberalismo teológico", "liberalismo-teologico"],
  denominacionalismo: ["Denominacionalismo", "denominacionalismo"],
  "sexualidad-y-genero": ["Ética sexual e ideología LGBT", "lgbt"],
  aborto: ["Aborto", "aborto"],
  "epistemologia-reformada": ["Epistemología reformada (Plantinga)", "plantinga"],
  "ontologia-y-epistemologia": ["Ontología y epistemología"],
  "dignidad-humana": ["Libertad y dignidad humana"],
  "historia-de-la-apologetica": ["Historia de la apologética", "historia-de-la-apologetica"],
  "fe-y-razon": ["Fe y razón"],
  resurreccion: ["Resurrección"],
  "dificultades-biblicas": ["Dificultades bíblicas"],
  agnosticismo: ["Agnosticismo"],
  metafisica: ["Metafísica", "metafisica"],
  trinidad: ["Trinidad"],
};

// Consultas duplicadas entre lotes: destino <- fuentes. El texto de cada
// fuente pasa a ser alias del destino. Agregar aquí al revisar el reporte.
const QUERY_MERGES: Record<string, string[]> = {
  "moral-sin-dios": ["si-dios-no-existe-todo-esta-permitido", "puede-el-ateo-llamar-malo-a-algo"],
  "respuesta-a-fesko": ["fesko-reforming-apologetics"],
  "van-til-aristoteles-aquino": ["van-til-y-aquino"],
  "hechos-brutos": ["hechos-interpretados"],
  "es-neutral-la-ciencia": ["ciencia-excluye-lo-sobrenatural"],
  "son-imposibles-los-milagros": ["milagros-de-jesus-reales"],
  "orden-del-ser-y-del-conocer": ["epistemologia-y-metafisica"],
};

const MAX_RESULTS = 6;

const k = JSON.parse(readFileSync(KNOWLEDGE_PATH, "utf8"));
const articles = new Map(loadArticles().map((a) => [a.ref, a]));
const entities = loadEntityRefs();
const isLiteral = literalChecker(articles);
const report: string[] = [];

const batchesPath = join(WORK, "batches.json");
if (!existsSync(batchesPath))
  throw new Error("No hay lotes: corre `bun run knowledge:prepare` primero.");
const assigned: string[][] = JSON.parse(readFileSync(batchesPath, "utf8"));
const batches = readdirSync(WORK)
  .filter((f) => /^batch-\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6)))
  .map((f) => ({ name: f, data: JSON.parse(readFileSync(join(WORK, f), "utf8")) }));
const missing = assigned
  .map((_, i) => `batch-${i + 1}.json`)
  .filter((f) => !batches.some((b) => b.name === f));
if (missing.length) report.push(`FALTAN LOTES: ${missing.join(", ")}`);

// Artículos reprocesados en estos lotes: su aporte anterior generado por LLM
// se reemplaza por el nuevo (lo manual se conserva).
const reprocessed = new Set(
  assigned.filter((_, i) => batches.some((b) => b.name === `batch-${i + 1}.json`)).flat(),
);
const keep = (origin: string, ref: string) => origin === "manual" || !reprocessed.has(ref);

// --- conceptos
const concepts = new Map<string, any>(k.concepts.map((c: any) => [c.id, c]));
const descriptions = new Map<string, string>();
for (const { data } of batches) {
  for (const [id, d] of Object.entries<string>(data.conceptDescriptions ?? {})) {
    if (!descriptions.has(id)) descriptions.set(id, d);
  }
  for (const c of data.newConcepts ?? []) {
    if (concepts.has(c.id) || SEEDS[c.id]) {
      if (!descriptions.has(c.id)) descriptions.set(c.id, c.description);
      continue;
    }
    concepts.set(c.id, {
      id: c.id,
      label: c.label,
      aliases: c.aliases ?? [],
      description: c.description,
      ...(c.tag ? { tag: c.tag } : {}),
    });
    report.push(`concepto nuevo: ${c.id} (${c.label})`);
  }
}
for (const [id, [label, tag]] of Object.entries(SEEDS)) {
  const description = descriptions.get(id);
  if (concepts.has(id) || !description) continue;
  concepts.set(id, { id, label, aliases: [], description, ...(tag ? { tag } : {}) });
}
const refOk = (ref: string) =>
  ref.startsWith("concepto:")
    ? concepts.has(ref.slice("concepto:".length))
    : articles.has(ref) || entities.has(ref);

// --- aristas
const edgeKey = (e: any) => `${e.source}|${e.target}|${e.type}`;
const edges = new Map<string, any>(
  k.edges.filter((e: any) => keep(e.origin, e.source)).map((e: any) => [edgeKey(e), e]),
);
for (const { name, data } of batches) {
  for (const e of data.edges ?? []) {
    if (!articles.has(e.source) || !refOk(e.target) || e.source === e.target) {
      report.push(`${name}: arista inválida ${e.source} → ${e.target}`);
      continue;
    }
    const edge: any = {
      source: e.source,
      target: e.target,
      type: e.type,
      weight: Math.min(1, Math.max(0, e.weight)),
      origin: "llm",
    };
    if (e.evidence) {
      if (isLiteral(e.source, e.evidence)) edge.evidence = e.evidence;
      else report.push(`${name}: evidence no literal, se quita (${e.source})`);
    }
    const prev = edges.get(edgeKey(edge));
    if (prev?.origin === "manual") continue;
    if (!prev || prev.weight < edge.weight) edges.set(edgeKey(edge), edge);
  }
}

// --- consultas
const cleanResult = (name: string, queryId: string, r: any) => {
  if (!articles.has(r.ref)) {
    report.push(`${name}: resultado a ref inexistente ${r.ref} (${queryId})`);
    return null;
  }
  if (!isLiteral(r.ref, r.snippet)) {
    report.push(`${name}: snippet no literal, se descarta (${queryId} → ${r.ref})`);
    return null;
  }
  const result: any = { ref: r.ref, snippet: r.snippet, origin: "llm" };
  if (r.anchor) {
    if (articles.get(r.ref)!.anchors.includes(r.anchor)) result.anchor = r.anchor;
    else report.push(`${name}: anchor inexistente, se quita (${r.anchor})`);
  }
  return result;
};
// Un resultado por artículo; el que ya estaba (o el primero) gana.
const addResults = (query: any, results: any[]) => {
  for (const r of results) {
    if (r && !query.results.some((x: any) => x.ref === r.ref)) query.results.push(r);
  }
};

const queries = new Map<string, any>(
  k.queries.map((q: any) => [
    q.id,
    { ...q, results: q.results.filter((r: any) => keep(r.origin, r.ref)) },
  ]),
);
for (const { name, data } of batches) {
  for (const addition of data.queryAdditions ?? []) {
    const query = queries.get(addition.queryId);
    if (!query) {
      report.push(`${name}: queryAddition a query inexistente ${addition.queryId}`);
      continue;
    }
    addResults(
      query,
      (addition.results ?? []).map((r: any) => cleanResult(name, addition.queryId, r)),
    );
  }
  for (const nq of data.newQueries ?? []) {
    const results: any[] = [];
    addResults(
      { results },
      (nq.results ?? []).map((r: any) => cleanResult(name, nq.id, r)),
    );
    const existing = queries.get(nq.id);
    if (existing) {
      addResults(existing, results);
      existing.aliases = [...new Set([...existing.aliases, ...(nq.aliases ?? [])])];
      continue;
    }
    const concept = nq.concept && concepts.has(nq.concept) ? nq.concept : undefined;
    queries.set(nq.id, {
      id: nq.id,
      text: nq.text,
      aliases: nq.aliases ?? [],
      ...(concept ? { concept } : {}),
      results,
    });
  }
}
for (const [target, sourceIds] of Object.entries(QUERY_MERGES)) {
  const query = queries.get(target);
  if (!query) continue;
  for (const id of sourceIds) {
    const source = queries.get(id);
    if (!source) continue;
    query.aliases = [...new Set([...query.aliases, source.text, ...source.aliases])];
    addResults(query, source.results);
    queries.delete(id);
  }
}
for (const [id, query] of queries) {
  query.results = query.results.slice(0, MAX_RESULTS);
  if (query.results.length === 0) {
    report.push(`query sin resultados, se elimina: ${id}`);
    queries.delete(id);
  }
}

// --- fuentes: hash de cada artículo con aporte, para detectar cambios.
const sources: Record<string, any> = {};
for (const article of articles.values()) {
  if (![...edges.values()].some((e) => e.source === article.ref)) {
    report.push(`SIN PROCESAR: ${article.ref}`);
    continue;
  }
  const prev = k.sources[article.ref];
  const fresh = reprocessed.has(article.ref) || !prev;
  sources[article.ref] = {
    hash: fresh ? article.hash : prev.hash,
    model: fresh ? "claude-opus-5-5" : prev.model,
    processedAt: fresh ? today() : prev.processedAt,
  };
}

const out = {
  version: 1,
  generatedAt: today(),
  concepts: [...concepts.values()],
  edges: [...edges.values()],
  queries: [...queries.values()],
  sources,
};
const parsed = knowledgeSchema.safeParse(out);
if (!parsed.success) {
  report.push(...parsed.error.issues.map((i) => `SCHEMA ${i.path.join(".")}: ${i.message}`));
}

const issues = batches.flatMap(({ name, data }) =>
  (data.issues ?? []).map((i: string) => `[${name}] ${i}`),
);
writeFileSync(
  join(WORK, "merge-report.txt"),
  [...report, "", "== problemas de contenido anotados por los lotes ==", ...issues].join("\n") +
    "\n",
);

console.log(
  `lotes ${batches.length}/${assigned.length} · conceptos ${out.concepts.length} · aristas ${out.edges.length} · ` +
    `consultas ${out.queries.length} · fuentes ${Object.keys(sources).length}/${articles.size}`,
);
console.log(
  `avisos ${report.length} · problemas de contenido ${issues.length} · esquema ${parsed.success ? "OK" : "ERROR"}`,
);
console.log(`Reporte: ${join(WORK, "merge-report.txt")}`);

if (!parsed.success) process.exit(1);
if (process.argv.includes("--write")) {
  writeFileSync(KNOWLEDGE_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`Escrito ${KNOWLEDGE_PATH}`);
}
