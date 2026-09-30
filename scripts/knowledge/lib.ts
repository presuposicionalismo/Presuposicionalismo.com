// Utilidades compartidas por los scripts del índice de conocimiento
// (src/data/knowledge.json). Ver scripts/knowledge/README.md.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "github-slugger";
import { slugifyStr } from "../../src/utils/slugify";

export const ROOT = fileURLToPath(new URL("../..", import.meta.url));
export const WORK = fileURLToPath(new URL(".work", import.meta.url));
export const KNOWLEDGE_PATH = join(ROOT, "src/data/knowledge.json");
// Salida estática del build (adaptador de Vercel): de ahí salen los ids
// reales de los encabezados, que son los únicos anchors válidos.
export const STATIC_DIR = join(ROOT, ".vercel/output/static");

export interface Article {
  ref: string;
  file: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  words: number;
  anchors: string[];
  hash: string;
}

export const today = () => new Date().toISOString().slice(0, 10);

export const hashFile = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 16);

// Mismo id que asigna el loader glob de Astro: el campo `slug` del
// frontmatter si existe, si no el nombre del archivo pasado por github-slugger.
function entryId(file: string, src: string): string {
  const custom = src.match(/^slug:\s*(.+)$/m);
  return custom ? custom[1].trim().replace(/^["']|["']$/g, "") : slug(file.replace(/\.mdx?$/, ""));
}

const frontmatterField = (fm: string, key: string) =>
  (fm.match(new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, "m")) ?? [])[1] ?? "";

// Artículos publicados del blog (sin `draft: true`), con sus anchors.
export function loadArticles(): Article[] {
  if (!existsSync(STATIC_DIR)) {
    throw new Error("Falta el build (.vercel/output/static): corre `bun run build` primero.");
  }
  const dir = join(ROOT, "src/content/blog");
  return readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .flatMap((f) => {
      const path = join(dir, f);
      const src = readFileSync(path, "utf8");
      if (/^draft: true$/m.test(src)) return [];
      const fm = src.split(/^---$/m)[1] ?? "";
      const title = frontmatterField(fm, "title");
      const url = `/blog/${slugifyStr(title)}/`;
      const html = join(STATIC_DIR, url, "index.html");
      const anchors = existsSync(html)
        ? [...readFileSync(html, "utf8").matchAll(/<h[2-4][^>]*id="([^"]+)"/g)]
            .map((m) => m[1])
            .filter((a) => a !== "footnote-label")
        : [];
      return [
        {
          ref: `blog:${entryId(f, src)}`,
          file: `src/content/blog/${f}`,
          title,
          description: frontmatterField(fm, "description"),
          tags: [
            ...(fm.match(/^tags:\n((?:\s+-.*\n?)+)/m)?.[1] ?? "").matchAll(/-\s*["']?([^"'\n]+)/g),
          ].map((m) => m[1].trim()),
          url,
          words: src.split(/\s+/).length,
          anchors,
          hash: hashFile(path),
        },
      ];
    });
}

// Refs de autores y libros (`autores:<id>`, `libros:<id>`).
export function loadEntityRefs(): Set<string> {
  const refs = new Set<string>();
  for (const collection of ["autores", "libros"]) {
    const dir = join(ROOT, "src/content", collection);
    for (const f of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
      refs.add(`${collection}:${entryId(f, readFileSync(join(dir, f), "utf8"))}`);
    }
  }
  return refs;
}

// Compara sin marcas de énfasis, escapes, tipo de comillas ni espacios, para
// que un fragmento copiado del artículo renderizado siga contando como literal.
const norm = (s: string) =>
  s
    .normalize("NFC")
    .replace(/[_*\\]/g, "")
    .replace(/[“”«»"'‘’]/g, '"')
    .replace(/\s+/g, " ")
    .toLowerCase();

// ¿Aparece `text` literalmente en el artículo? Se permite cortar con "…"
// entre fragmentos literales.
export function literalChecker(articles: Map<string, Article>) {
  const bodies = new Map<string, string>();
  return (ref: string, text: string): boolean => {
    const article = articles.get(ref);
    if (!article) return false;
    if (!bodies.has(ref)) bodies.set(ref, norm(readFileSync(join(ROOT, article.file), "utf8")));
    const body = bodies.get(ref)!;
    return text
      .split("…")
      .map((part) =>
        norm(part)
          .trim()
          .replace(/^[.,;:\s-]+|[.,;:\s-]+$/g, ""),
      )
      .filter((part) => part.length > 8)
      .every((part) => body.includes(part));
  };
}
