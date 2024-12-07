import path from "path";
import { glob } from "glob";
import { promises as fs } from "fs";
import matter from "gray-matter";

async function getPosts() {
  const pathToContent = path.join(process.cwd(), "/src/content/**/*.mdx");
  const files = await glob(pathToContent);
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, "utf8");
      return matter(content);
    })
  );

  return posts;
}