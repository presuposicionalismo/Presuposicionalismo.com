import { exec } from "node:child_process";
import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { randomUUID, createHash } from "node:crypto";
import { existsSync } from "node:fs";

const execAsync = promisify(exec);

// Persistent cache directory (survives builds if not cleaned)
const CACHE_DIR = join(process.cwd(), ".og-cache");


interface GenerateOgOptions {
    author?: string;
    coverBook?: string; // This expects a filesystem path or public URL (we serve FS path to typst)
}

export async function generateOgImage(
    title: string,
    description: string,
    type: "blog" | "book" = "blog",
    options: GenerateOgOptions = {}
) {
    // 1. Determine Template and Driver based on type
    const templateName = type === "book" ? "og_book.typ" : "og_blog.typ";
    const driverName = type === "book" ? "og_driver_book.typ" : "og_driver_blog.typ";

    const templatePath = join(process.cwd(), `src/assets/${templateName}`);
    const templateContent = await readFile(templatePath, "utf-8");

    // Hash inputs: title, description, template content, type, and extra options
    const hashInput = JSON.stringify({
        title,
        description,
        template: templateContent,
        type,
        ...options
    });
    const hash = createHash("sha256").update(hashInput).digest("hex");

    const cachedImagePath = join(CACHE_DIR, `${hash}.png`);

    // Ensure cache dir exists
    if (!existsSync(CACHE_DIR)) {
        await mkdir(CACHE_DIR, { recursive: true });
    }

    // 2. Check Cache
    if (existsSync(cachedImagePath)) {
        return await readFile(cachedImagePath);
    }

    // 3. Cache Miss - Generate with Typst
    const uniqueId = randomUUID();
    const dataPath = join(process.cwd(), `dist/og-${uniqueId}.json`);
    const outputPath = join(process.cwd(), `dist/og-${uniqueId}.png`);
    const driverPath = join(process.cwd(), `src/assets/${driverName}`);

    // Resolve Code Image Path if present
    // Typst needs an absolute path to access filesystem images unless configured otherwise.
    // Assuming coverBook comes as a relative path (e.g., "/coverbook/image.jpg")
    let coverBookPath = undefined;
    if (options.coverBook) {
        const bookPath = options.coverBook;
        if (bookPath.startsWith("/src")) {
            // Path points to src/assets (e.g. /src/assets/coverbook/img.webp).
            // Pass it as-is, Typst will resolve it relative to the project root (--root).
            coverBookPath = bookPath;
        } else {
            // Fallback for paths assumed to be in public
            const relativePath = bookPath.startsWith('/') ? bookPath.slice(1) : bookPath;
            // Typst run from root needs "public/foo.png"
            coverBookPath = "/" + join("public", relativePath);
        }
    }

    const data = JSON.stringify({
        title,
        description,
        author: options.author || "Autor Desconocido",
        coverBookPath: coverBookPath,
    });

    try {
        // Ensure dist exists
        const distDir = join(process.cwd(), "dist");
        if (!existsSync(distDir)) {
            await mkdir(distDir, { recursive: true });
        }

        await writeFile(dataPath, data);

        const fontPath = join(process.cwd(), "public/fonts");
        const relativeDataPath = `/dist/og-${uniqueId}.json`;

        // We explicitly set root to cwd so we can access everything
        const command = `typst compile --root ${process.cwd()} --font-path ${fontPath} --input data=${relativeDataPath} ${driverPath} ${outputPath}`;

        await execAsync(command);

        const imageBuffer = await readFile(outputPath);

        // 4. Update Cache
        await writeFile(cachedImagePath, imageBuffer as any);

        // Cleanup temp files
        await Promise.all([unlink(dataPath), unlink(outputPath)]);

        return imageBuffer;

    } catch (error) {
        console.error("Error generating OG image with Typst:", error);
        try { await unlink(dataPath); } catch { }
        try { await unlink(outputPath); } catch { }
        throw error;
    }
}

