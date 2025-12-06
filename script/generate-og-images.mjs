import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import matter from 'gray-matter';
import OgImageTemplate from '../src/components/OgImageTemplate.tsx';
import React from 'react'; // Necesario para JSX

// Define el tamaño de la imagen de Open Graph
const WIDTH = 1200;
const HEIGHT = 630;

// Ruta a la fuente que Satori usará. Es crucial que Satori tenga acceso a un archivo de fuente.
// Puedes descargar una fuente Open Source (ej. Inter, Noto Sans) y colocarla en tu carpeta `public/fonts`
// Por ahora, asumimos que tienes una fuente Inter-Regular.ttf en `public/fonts/`
const fontPath = path.resolve(process.cwd(), 'public', 'fonts', 'Inter-Regular.ttf');
let fontData;

try {
  fontData = await fs.readFile(fontPath);
} catch (error) {
  console.error(`Error: No se pudo cargar la fuente en ${fontPath}. Asegúrate de que existe.`, error);
  console.info('Puedes descargar una fuente como Inter de Google Fonts y colocar Inter-Regular.ttf en public/fonts/');
  process.exit(1); // Salir si la fuente no está disponible
}

// Directorios
const contentDir = path.resolve(process.cwd(), 'src', 'content');
const ogImageOutputDir = path.resolve(process.cwd(), 'public', 'og'); // Donde se guardarán las imágenes generadas

async function generateOgImage(title, description, slug, date, author) {
  const svg = await satori(
    React.createElement(OgImageTemplate, {
      title,
      description,
      siteName: "Presuposicionalismo.com",
      date,
      author,
    }),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400, // Regular
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontData, // Usa la misma fuente para negrita si no tienes una fuente bold separada
          weight: 700, // Bold
          style: 'normal',
        },
      ],
      // Ajustes de emojificación si necesitas soporte para emojis (puede requerir fuentes adicionales)
      // twMerge: true, // Si usas Tailwind CSS
      // loadGoogleFonts: true,
      // debug: true,
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: WIDTH,
    },
  });

  const pngBuffer = await resvg.render().asPng();

  // Asegúrate de que el directorio de salida exista
  await fs.mkdir(ogImageOutputDir, { recursive: true });

  const outputFile = path.join(ogImageOutputDir, `${slug}.png`);
  await fs.writeFile(outputFile, pngBuffer);
  console.log(`✨ Generated OG image for: ${title} -> ${outputFile}`);
}

async function getMarkdownFiles(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getMarkdownFiles(path.join(dir, item.name)))];
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(path.join(dir, item.name));
    }
  }
  return files;
}


async function main() {
  console.log('Generating Open Graph images...');

  // Asumimos que tus colecciones de contenido están dentro de src/content
  // Por ejemplo: src/content/blog/post-1.md
  const markdownFiles = await getMarkdownFiles(contentDir);

  for (const file of markdownFiles) {
    const fileContent = await fs.readFile(file, 'utf-8');
    const { data } = matter(fileContent); // `data` contiene el frontmatter

    // Puedes ajustar esto para que coincida con las propiedades de tu frontmatter
    const title = data.title || path.basename(file, path.extname(file));
    const description = data.description || '';
    const date = data.pubDate ? new Date(data.pubDate).toLocaleDateString('es-ES') : undefined; // Formato de fecha
    const author = data.author || '';

    // Genera un slug seguro para el nombre del archivo de imagen
    const slug = data.slug || path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

    // Si ya tienes una propiedad 'ogImage' en el frontmatter y está definida, puedes omitir la generación
    // o decidir si sobrescribirla. Para este ejemplo, generamos siempre si no hay 'ogImage' explícita
    // o si queremos una imagen generada.
    if (data.ogImage === false) {
      console.log(`Skipping OG image for ${title} as ogImage is set to false.`);
      continue;
    }

    try {
      await generateOgImage(title, description, slug, date, author);
    } catch (error) {
      console.error(`Error generating OG image for ${title}:`, error);
    }
  }

  console.log('Open Graph image generation complete.');
}

main().catch(console.error);
