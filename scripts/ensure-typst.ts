// Deja un binario de typst en node_modules/.cache/typst/ para generar las
// imágenes OG (src/utils/generateOg.ts) cuando el entorno de build no lo
// trae, como en Vercel. Si ya hay uno en el PATH, no hace nada. Si la
// descarga falla, solo avisa: el sitio se construye con las imágenes de
// respaldo.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VERSION = "0.15.1";
const DIR = join(process.cwd(), "node_modules/.cache/typst");
const BIN = join(DIR, "typst");

const TARGETS: Record<string, string> = {
  "linux-x64": "x86_64-unknown-linux-musl",
  "linux-arm64": "aarch64-unknown-linux-musl",
};

function installed(bin: string): string | null {
  try {
    return execFileSync(bin, ["--version"], { encoding: "utf-8" }).trim();
  } catch {
    return null;
  }
}

const found = installed("typst") ?? (existsSync(BIN) ? installed(BIN) : null);
if (found) {
  console.log(`[ensure-typst] ${found}`);
  process.exit(0);
}

const target = TARGETS[`${process.platform}-${process.arch}`];
if (!target) {
  console.warn(
    `[ensure-typst] Sin binario para ${process.platform}-${process.arch}; instala typst a mano.`,
  );
  process.exit(0);
}

const name = `typst-${target}`;
const url = `https://github.com/typst/typst/releases/download/v${VERSION}/${name}.tar.xz`;
try {
  mkdirSync(DIR, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const archive = join(DIR, `${name}.tar.xz`);
  writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
  execFileSync("tar", ["-xJf", archive, "-C", DIR, "--strip-components=1", `${name}/typst`]);
  rmSync(archive);
  console.log(`[ensure-typst] Descargado: ${installed(BIN)}`);
} catch (error) {
  console.warn(`[ensure-typst] No se pudo descargar typst ${VERSION} (${url}):`, error);
}
