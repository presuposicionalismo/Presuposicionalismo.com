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

| Módulo | Encabezado canónico | Qué va ahí |
|---|---|---|
| Sobre el libro | `## Sobre el libro` | Resumen/presentación general, escrito para el sitio (no necesariamente texto del libro). |
| Extracto | `## Extracto` | Fragmento textual tomado directamente del propio libro/documento. |
| Recomendaciones | `## Recomendaciones` | Testimonios de terceros que respaldan el libro. Cada uno vía `<Quote type="testimonio" author="..." reference="...">`. |
| Autor | `## Autor` | Biografía breve del autor. |
| Cita destacada | (sin encabezado propio) | Un epígrafe temático suelto, no necesariamente un respaldo del libro. Vía `<Quote type="default" author="...">`, insertado dentro de otro módulo (normalmente al final de "Sobre el libro"). |

No se inventan variantes nuevas de encabezado ("Introducción", "Extracto de
prensa", etc.) para la misma función — si algo cumple el rol de "Sobre el
libro", se llama `## Sobre el libro`.

## Reglas estructurales (piso y techo)

1. **Nunca repetir el título como `# H1`** en el body. `BookDetails.astro`
   ya lo muestra en la cabecera de la página.
2. **El body nunca queda vacío.** Como mínimo, un módulo `## Sobre el libro`
   — puede derivarse de la `description` del frontmatter si no hay nada
   mejor disponible. Excepción: si la `description` misma es sospechosa o
   incorrecta (ver `docs/pendientes/contenido.md`), no se usa como fuente
   hasta corregirla — es preferible un hueco documentado a un dato erróneo
   publicado.
3. **Toda cita pasa por el componente `Quote`** (`src/components/mdx/Quote.svelte`),
   nunca un blockquote de markdown crudo con una atribución escrita a mano
   (ej. `--- Fulano` al final de un blockquote).
4. **Todos los encabezados de módulo al mismo nivel (`##`).** No se mezcla
   `### Autor` en un libro con `## Autor` en otro.

## Seguimiento

Los huecos de contenido reales (libros sin extracto disponible, `description`
incorrectas, etc.) se documentan como pendientes en
[`docs/pendientes/contenido.md`](../pendientes/contenido.md), no se rellenan
con contenido inventado para satisfacer la regla de piso.
