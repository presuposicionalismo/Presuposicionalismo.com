# Política de contenido — cuerpo de las páginas de libro (`/libros/[slug]`)

Objetivo: la variedad de contenido entre libros está bien y se espera (no todos
tienen un extracto, una recomendación de un tercero, o una biografía del
autor disponibles). Lo que no está bien es que esa variedad sea accidental
en vez de deliberada. Esta política separa las dos cosas: el contenido puede
variar libremente, la estructura y la presentación no.

## Vocabulario fijo de módulos

Cada libro elige, del siguiente menú, los módulos que aplican — ninguno es
obligatorio salvo la regla de piso más abajo — pero cuando un módulo
aparece, usa siempre el mismo encabezado exacto y el mismo componente.

| Módulo          | Encabezado canónico     | Qué va ahí                                                                                                                                                                                   |
| --------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sobre el libro  | `## Sobre el libro`     | Resumen/presentación general, escrito para el sitio (no necesariamente texto del libro).                                                                                                     |
| Extracto        | `## Extracto`           | Fragmento textual tomado directamente del propio libro/documento.                                                                                                                            |
| Recomendaciones | `## Recomendaciones`    | Testimonios de terceros que respaldan el libro. Cada uno vía `<Quote type="testimonio" author="..." reference="...">`.                                                                       |
| Cita destacada  | (sin encabezado propio) | Un epígrafe temático suelto, no necesariamente un respaldo del libro. Vía `<Quote type="default" author="...">`, insertado dentro de otro módulo (normalmente al final de "Sobre el libro"). |

No se inventan variantes nuevas de encabezado ("Introducción", "Extracto de
prensa", etc.) para la misma función — si algo cumple el rol de "Sobre el
libro", se llama `## Sobre el libro`.

Lo que **no** va en el body, porque `BookLayout.astro` ya lo genera:

- **Autor.** La sección "Sobre el autor / Sobre los autores" sale sola de
  los perfiles en `src/content/autores/` (nombre, fechas, `role`, enlace al
  perfil). La biografía se escribe en el perfil del autor, no en cada libro.
- **Ficha técnica** (formato, idioma, acceso, fecha) y botón de descarga.

## Reglas estructurales (piso y techo)

1. **Nunca repetir el título como `# H1`** en el body. `BookLayout.astro`
   ya lo muestra en la cabecera de la página.
2. **La página nunca queda sin "Sobre el libro".** Si el body no trae un
   `## Sobre el libro`, `BookLayout.astro` lo arma automáticamente con la
   `description` del frontmatter. Solo se escribe a mano cuando hay algo
   mejor que la `description` (varios párrafos, citas, etc.); en ese caso
   la `description` ya no se muestra en la página, solo como resumen en la
   biblioteca y en meta tags. Ojo: como la `description` se publica tal
   cual, una `description` sospechosa o incorrecta (ver
   `docs/pendientes/contenido.md`) queda visible hasta que se corrija en el
   frontmatter; no se tapa con un "Sobre el libro" inventado.
3. **Toda cita pasa por el componente `Quote`** (`src/components/mdx/Quote.svelte`),
   nunca un blockquote de markdown crudo con una atribución escrita a mano
   (ej. `--- Fulano` al final de un blockquote).
4. **Todos los encabezados de módulo al mismo nivel (`##`).** No se mezcla
   `### Extracto` en un libro con `## Extracto` en otro.

## Seguimiento

Los huecos de contenido reales (libros sin extracto disponible, `description`
incorrectas, etc.) se documentan como pendientes en
[`docs/pendientes/contenido.md`](../pendientes/contenido.md), no se rellenan
con contenido inventado para satisfacer la regla de piso.
