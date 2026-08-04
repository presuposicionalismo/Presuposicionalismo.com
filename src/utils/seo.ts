// Largo recomendado para una meta description / snippet de buscador.
// Google trunca alrededor de 155-160 caracteres; nos quedamos en el
// límite conservador para dejar margen a variaciones de fuente/dispositivo.
const MAX_LENGTH = 155;

/**
 * Devuelve el texto a usar en <meta name="description">, og:description,
 * twitter:description y el campo `description` de JSON-LD.
 *
 * Prioridad:
 * 1. `seoDescription` manual, si se definió en el frontmatter.
 * 2. `description` completa, si ya entra en el límite.
 * 3. `description` recortada en el último espacio antes del límite, con
 *    elipsis -- así nunca se corta a mitad de palabra ni queda a merced
 *    de dónde decida truncar el buscador.
 *
 * Importante: esto NO reemplaza `description` en ningún lugar donde se
 * muestra como resumen de contenido en el propio sitio (BlogCarousel,
 * FeaturedPost, BookInfoTabs) -- esos siguen usando la description
 * completa tal cual la escribiste, sin recorte.
 */
export function getSeoDescription(
  description: string,
  seoDescription?: string,
): string {
  if (seoDescription) return seoDescription;
  if (description.length <= MAX_LENGTH) return description;

  const truncated = description.slice(0, MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${cut.trimEnd()}…`;
}
