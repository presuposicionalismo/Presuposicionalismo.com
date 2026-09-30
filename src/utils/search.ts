// Búsqueda del menú ⌘K: búsquedas precalculadas (/search-presets.json,
// generadas del lado del desarrollador) + texto completo con Pagefind
// (índice estático generado después del build, ver `search:index`).

export interface PresetResult {
  title: string;
  url: string;
  snippet: string;
}

export interface Preset {
  text: string;
  aliases: string[];
  results: PresetResult[];
}

export interface ArticleHit {
  title: string;
  url: string;
  // HTML de Pagefind con los términos envueltos en <mark>.
  excerpt: string;
}

// Minúsculas, sin acentos ni signos: "¿Es circular?" -> "es circular".
export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const STOPWORDS = new Set(
  "a al con de del el en es la las lo los no para por que se su un una y o como cual".split(" "),
);

// Plural a singular, palabra por palabra y solo para comparar:
// "presuposiciones" -> "presuposicion", "leyes" -> "ley", "mentes" -> "mente".
const singular = (normalized: string) =>
  normalized
    .split(" ")
    .map((w) => (w.length > 4 ? w.replace(/(?<=[lnrdjy])es$|(?<=[aeiou])s$/, "") : w))
    .join(" ");

function tokens(str: string): string[] {
  return singular(normalize(str))
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Puntaje de una forma (texto o alias) para lo escrito, 0 si no coincide.
// Compara por palabras completas o comienzo de palabra, para que "tag" no
// coincida dentro de "hostage", y pondera cuánto de cada lado cubre la
// coincidencia: "van til kant" prefiere la pregunta sobre Van Til y Kant a
// otra que solo tenga el alias "Kant".
function scoreForm(form: string, q: string, qTokens: string[]): number {
  const f = singular(normalize(form));
  if (!f) return 0;
  if (f === q) return 100;
  if (f.length >= 3 && ` ${q} `.includes(` ${f} `)) return 40 + (40 * f.length) / q.length;
  if (q.length >= 3 && ` ${f}`.includes(` ${q}`)) return 40 + (40 * q.length) / f.length;
  // Cada palabra de lo escrito como prefijo de alguna palabra de la forma
  // ("presup circ" encuentra "presuposicionalismo circular").
  const fTokens = tokens(form);
  const allMatch = qTokens.every((qt) => fTokens.some((ft) => ft.startsWith(qt)));
  return allMatch ? Math.min(70, 30 + 10 * qTokens.length) : 0;
}

// El texto de la pregunta desempata frente a los alias: con "fesko" gana
// "Respuesta a Fesko…" y no otra pregunta que tenga "Fesko" solo como alias.
function scorePreset(preset: Preset, query: string): number {
  const q = singular(normalize(query));
  const qTokens = tokens(query);
  if (!q || qTokens.length === 0) return 0;
  const textScore = scoreForm(preset.text, q, qTokens);
  const best = Math.max(textScore, ...preset.aliases.map((a) => scoreForm(a, q, qTokens)));
  return best > 0 && textScore > 0 ? best + 5 : best;
}

export function matchPresets(presets: Preset[], query: string, limit = 1): Preset[] {
  return presets
    .map((preset) => ({ preset, score: scorePreset(preset, query) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((m) => m.preset);
}

let presetsPromise: Promise<Preset[]> | undefined;

export function loadPresets(): Promise<Preset[]> {
  presetsPromise ??= fetch("/search-presets.json")
    .then((res) => (res.ok ? res.json() : []))
    .catch(() => []);
  return presetsPromise;
}

interface PagefindResult {
  words: number[];
  data(): Promise<{ url: string; excerpt: string; meta: { title?: string } }>;
}

interface Pagefind {
  init(): Promise<void>;
  options(opts: Record<string, unknown>): Promise<void>;
  debouncedSearch(
    term: string,
    options?: Record<string, unknown>,
    debounceMs?: number,
  ): Promise<{ results: PagefindResult[] } | null>;
}

let pagefindPromise: Promise<Pagefind | null> | undefined;

// El índice solo existe después de `search:index`; en `astro dev` sin él
// la búsqueda cae a los presets sin romperse.
function loadPagefind(): Promise<Pagefind | null> {
  // URL absoluta: con una ruta relativa, Vite en dev reescribe el import
  // (?import) y responde 500 por ser un archivo de public/.
  const url = new URL("/pagefind/pagefind.js", window.location.origin).href;
  pagefindPromise ??= import(/* @vite-ignore */ url)
    .then(async (pagefind: Pagefind) => {
      await pagefind.options({ excerptLength: 24 });
      await pagefind.init();
      return pagefind;
    })
    .catch(() => null);
  return pagefindPromise;
}

// Pagefind tolera errores de escritura con demasiada generosidad: con texto
// sin sentido ("qqqqzzzz") puede resaltar una sola letra ("Q."). Un resultado
// cuenta si alguna palabra resaltada, o del título, comparte el comienzo
// (3 letras) con una palabra de lo escrito; así pasan las variantes que sí
// valen ("presuposiciones" / "presuposición").
function resemblesQuery(hit: ArticleHit, query: string): boolean {
  const marked = [...hit.excerpt.matchAll(/<mark>(.*?)<\/mark>/g)].map((m) => m[1]);
  const words = normalize([hit.title, ...marked].join(" ")).split(" ");
  const stems = normalize(query)
    .split(" ")
    .filter((t) => t.length >= 3)
    .map((t) => t.slice(0, 3));
  return stems.length === 0 || stems.some((stem) => words.some((w) => w.startsWith(stem)));
}

// null = la búsqueda fue reemplazada por otra más reciente (debounce).
export async function searchArticles(query: string, limit = 6): Promise<ArticleHit[] | null> {
  const pagefind = await loadPagefind();
  if (!pagefind) return [];
  const search = await pagefind.debouncedSearch(query, {}, 200);
  if (!search) return null;
  // Sin coincidencia real, Pagefind puede devolver páginas sin ninguna
  // palabra encontrada (p. ej. con "eutifron"): se descartan.
  const relevant = search.results.filter((result) => result.words.length > 0);
  const hits = await Promise.all(
    relevant.slice(0, limit * 2).map(async (result) => {
      const data = await result.data();
      return { title: data.meta.title ?? data.url, url: data.url, excerpt: data.excerpt };
    }),
  );
  return hits.filter((hit) => resemblesQuery(hit, query)).slice(0, limit);
}

export function preloadSearch(): void {
  void loadPresets();
  void loadPagefind();
}
