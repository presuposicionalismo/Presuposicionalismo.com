// Prepara el trabajo de indexación: detecta los artículos publicados que
// faltan en knowledge.json o cambiaron desde que se procesaron, y los reparte
// en lotes de tamaño parecido para leerlos en paralelo (ver README.md).
//
//   bun run knowledge:prepare            solo lo nuevo o modificado
//   bun run knowledge:prepare --all      todos los artículos publicados
//   bun run knowledge:prepare --words 28000   palabras por lote (por defecto)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { KNOWLEDGE_PATH, WORK, loadArticles } from "./lib";

const args = process.argv.slice(2);
const all = args.includes("--all");
const wordsPerBatch = Number(args[args.indexOf("--words") + 1]) || 28000;

const knowledge = JSON.parse(readFileSync(KNOWLEDGE_PATH, "utf8"));
const articles = loadArticles();
const pending = articles.filter((a) => all || knowledge.sources[a.ref]?.hash !== a.hash);

// Empezar limpio: lotes o reportes viejos no deben mezclarse con estos.
rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

writeFileSync(join(WORK, "manifest.json"), JSON.stringify(articles, null, 1));
writeFileSync(
  join(WORK, "articles-index.json"),
  JSON.stringify(
    articles.map(({ ref, title, description, tags }) => ({ ref, title, description, tags })),
    null,
    1,
  ),
);

// Reparto greedy: el artículo más largo va al lote con menos palabras.
const count = Math.max(1, Math.ceil(pending.reduce((n, a) => n + a.words, 0) / wordsPerBatch));
const batches: { refs: string[]; words: number }[] = Array.from({ length: count }, () => ({
  refs: [],
  words: 0,
}));
for (const article of [...pending].sort((a, b) => b.words - a.words)) {
  const lightest = batches.reduce((min, b) => (b.words < min.words ? b : min));
  lightest.refs.push(article.ref);
  lightest.words += article.words;
}
const nonEmpty = batches.filter((b) => b.refs.length > 0);
writeFileSync(
  join(WORK, "batches.json"),
  JSON.stringify(
    nonEmpty.map((b) => b.refs),
    null,
    1,
  ),
);

console.log(
  `${articles.length} publicados · ${pending.length} por procesar · ${nonEmpty.length} lotes`,
);
nonEmpty.forEach((b, i) =>
  console.log(`  lote ${i + 1}: ${b.refs.length} artículos, ${b.words} palabras`),
);
if (nonEmpty.length > 0) {
  console.log(
    `\nCada lote N se procesa siguiendo scripts/knowledge/SPEC.md y deja ${WORK}/batch-N.json.`,
  );
}
