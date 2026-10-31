import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
// Caché entre builds: solo se recompila lo que cambió. Va dentro de
// node_modules/.cache porque Vercel conserva esa carpeta entre deploys.
const CACHE_DIR = join(ROOT, "node_modules/.cache/og");
// Lo deja ahí scripts/ensure-typst.ts cuando el entorno de build no trae
// typst (Vercel); en local se usa el del PATH.
const DOWNLOADED_TYPST = join(ROOT, "node_modules/.cache/typst/typst");

function typstBin(): string {
  if (process.env.TYPST_BIN) return process.env.TYPST_BIN;
  if (existsSync(DOWNLOADED_TYPST)) return DOWNLOADED_TYPST;
  return "typst";
}

let available: Promise<boolean> | undefined;

/**
 * Sin typst no hay tarjetas: los layouts usan su imagen de respaldo y las
 * rutas /og/... no se generan. Se avisa una vez en vez de romper el build.
 */
export function typstAvailable(): Promise<boolean> {
  available ??= execFileAsync(typstBin(), ["--version"]).then(
    () => true,
    () => {
      console.warn("[og] typst no está disponible: se usan las imágenes de respaldo.");
      return false;
    },
  );
  return available;
}

interface OgInput {
  title: string;
  description: string;
  author?: string;
  // Ruta tal como está en el frontmatter: "/src/assets/coverbook/x.webp".
  // Typst la resuelve contra --root, que es la raíz del proyecto.
  coverBook?: string;
}

/** Compila la tarjeta OG (1200×630 px) con la plantilla Typst de src/assets. */
export async function generateOgImage(type: "blog" | "book", input: OgInput): Promise<Response> {
  const driver = join(ROOT, `src/assets/og_driver_${type}.typ`);
  const template =
    (await readFile(join(ROOT, `src/assets/og_${type}.typ`), "utf-8")) +
    (await readFile(join(ROOT, "src/assets/og_base.typ"), "utf-8"));

  const data = JSON.stringify({
    title: input.title,
    description: input.description,
    author: input.author ?? "",
    ...(input.coverBook && { coverBookPath: input.coverBook }),
  });

  // La portada entra al hash por contenido: si se reemplaza la imagen
  // con el mismo nombre, la tarjeta se regenera.
  const hasher = createHash("sha256").update(type).update(template).update(data);
  if (input.coverBook) hasher.update(await readFile(join(ROOT, input.coverBook)));
  const hash = hasher.digest("hex");
  const cached = join(CACHE_DIR, `${hash}.png`);
  if (existsSync(cached)) return pngResponse(await readFile(cached));

  // El JSON tiene que quedar dentro de --root para que Typst lo lea.
  await mkdir(CACHE_DIR, { recursive: true });
  const dataPath = join(CACHE_DIR, `${hash}.json`);
  const workDir = await mkdtemp(join(tmpdir(), "og-"));
  const outPath = join(workDir, "og.png");

  try {
    await writeFile(dataPath, data);
    await execFileAsync(typstBin(), [
      "compile",
      "--root",
      ROOT,
      // Solo las fuentes del sitio: el resultado no depende de la máquina
      // y se evita escanear las del sistema en cada compilación.
      "--ignore-system-fonts",
      "--font-path",
      join(ROOT, "public/fonts"),
      "--input",
      `data=/node_modules/.cache/og/${hash}.json`,
      "--ppi",
      "72",
      driver,
      outPath,
    ]);
    const png = await readFile(outPath);
    await writeFile(cached, png);
    return pngResponse(png);
  } finally {
    await rm(dataPath, { force: true });
    await rm(workDir, { recursive: true, force: true });
  }
}

function pngResponse(png: Buffer): Response {
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
