/**
 * Las ediciones propias del sitio no se descargan de un enlace directo:
 * `downloadBook` apunta a su repositorio en GitHub (fuentes y PDF), y el
 * botón tiene que decirlo en vez de prometer "Descargar PDF".
 */
export function isRepository(url: string): boolean {
  try {
    return new URL(url).hostname === "github.com";
  } catch {
    return false;
  }
}
