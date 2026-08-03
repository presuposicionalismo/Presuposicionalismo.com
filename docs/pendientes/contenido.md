# Pendientes de contenido

## Notas al pie huérfanas (falta el texto original)

Tras estandarizar las notas al pie de todo el blog al formato `[^n]`, quedaron 3 posts con marcadores que no tienen texto de definición en ninguna parte del archivo (probablemente se perdió en una migración anterior, o el original nunca lo tuvo). Los 3 están en borrador (`draft: true`), así que no afectan el sitio publicado — pero hay que resolverlo antes de publicarlos.

- **`src/content/blog/Dos Guerreros Cristianos_ Cornelius Van Til y Francis A. Schaeffer comparados.mdx`** — 81 notas (`[^1]` a `[^81]`) sin ningún texto de definición. Se revisó el historial de git hasta el commit original y ya carecía de la lista. Probable fuente: *"Two Christian Warriors: Cornelius Van Til and Francis Schaeffer Compared"* de William Edgar.
- **`src/content/blog/La Controversia Gordon Clark y Cornelius Van Til.mdx`** — notas 50, 81, 101 y 116 no tienen marcador en el cuerpo (definición huérfana, no se sabe a qué frase corresponden exactamente).
- **`src/content/blog/El Problema De Conocer Lo «Sobrenatural».mdx`** — notas 40, 41 y 42 sin texto. La 41 probablemente corresponde a una cita de W. H. Walsh y la 42 a una cita de Nietzsche (*Más Allá del Bien y del Mal*).

**Qué se necesita:** localizar el texto/PDF original de cada artículo para completar las definiciones faltantes.

**Detectado:** 2026-08-03

## Notas al pie a confirmar (ya publicadas)

- **`src/content/blog/Venciendo el Prejuicio Anti-Metafísica.mdx`** — la nota 16 existe como definición pero no tiene marcador en el cuerpo (inofensivo, no se ve en la página, pero la cita "Bahnsen, Siempre Preparados, 184" queda sin vincular a ninguna frase).
- **`src/content/blog/¿Son la ciencia y la lógica neutrales y sin presuposiciones.mdx`** — las notas 9, 13 y 16 no tenían marcador visible en el original; se ubicaron por coincidencia de contenido (Sproul/*Knowing Scripture*, lista de contrastes de Grant, referencia a Simon Kistemaker respectivamente). Vale la pena confirmar que quedaron en el lugar correcto. La nota 31 no tenía definición en ninguna parte del original — se quitó el marcador en vez de dejar una referencia rota visible.

**Qué se necesita:** revisión editorial rápida, confirmar posición de las notas 9/13/16.

**Detectado:** 2026-08-03

## Portadas sin usar (imágenes curadas disponibles)

En `src/assets/coverblog/` quedan 4 imágenes reales (no placeholder) sin asignar a ningún post:

- `2020-11-02.webp` — gráfico de onda senoidal.
- `2021-02-14.webp` — acuarela de la tierra.
- `2020-08-13.webp` — retrato de hombre contemporáneo, no identificado.

**Qué se necesita:** esperar a que se publique un post que calce temáticamente, o confirmar la identidad del hombre en `2020-08-13.webp` si se quiere usar.

**Detectado:** 2026-08-03

## Página de autores (planeada para la próxima iteración)

El usuario mencionó que en la próxima iteración del sitio quiere dedicar una página a autores, con su propio campo en el frontmatter (`src/content.config.ts`, colección `blog`). Hoy no existe ese campo ni la página.

**Qué se necesita:** diseñar el campo de frontmatter (¿string simple? ¿referencia a una colección `autores`?) y la página en sí. Sin acción por ahora — queda anotado para cuando se retome.

**Detectado:** 2026-08-03
