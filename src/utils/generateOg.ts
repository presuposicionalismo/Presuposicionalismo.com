import { exec } from "node:child_process";
import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { randomUUID, createHash } from "node:crypto";
import { existsSync } from "node:fs";

const execAsync = promisify(exec);

// Persistent cache directory (survives builds if not cleaned)
const CACHE_DIR = join(process.cwd(), ".og-cache");

export async function generateOgImage(title: string, description: string) {
    // 1. Calculate Hash of the Content + Template
    // We include the template content in hash so if design changes, we regenerate everything.
    const templatePath = join(process.cwd(), "src/assets/og.typ");
    const templateContent = await readFile(templatePath, "utf-8");

    // Hash of inputs determines component uniqueness
    const hashInput = JSON.stringify({ title, description, template: templateContent });
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
    const outputPath = join(process.cwd(), `dist/og-${uniqueId}.png`); // Temp output
    const driverPath = join(process.cwd(), "src/assets/og_driver.typ");

    const data = JSON.stringify({
        title,
        description,
    });

    try {
        // Ensure dist exists (Astro might clean it)
        const distDir = join(process.cwd(), "dist");
        if (!existsSync(distDir)) {
            await mkdir(distDir, { recursive: true });
        }

        await writeFile(dataPath, data);

        const fontPath = join(process.cwd(), "public/fonts");

        // Pass root-relative path for data to avoid path issues
        const relativeDataPath = `/dist/og-${uniqueId}.json`;

        const command = `typst compile --root ${process.cwd()} --font-path ${fontPath} --input data=${relativeDataPath} ${driverPath} ${outputPath}`;

        await execAsync(command);

        const imageBuffer = await readFile(outputPath);

        // 4. Update Cache
        await writeFile(cachedImagePath, imageBuffer as any);

        // We don't strictly need to update manifest.json if we just assume filename=hash, but it's good practice for debugging/tracking.
        // Actually, let's skip explicit manifest update for simplicity if we rely on hash filenames. 
        // But the plan said "manifest", so let's check if we strictly need it.
        // Actually, just using `hash.png` is smarter and self-cleaning (unused hashes just sit there or can be GC'd later).
        // I will stick to filename=hash for simplicity and robustness.

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
