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

## `description` incorrecta en "La apologética de Justino" (body vacío, sin fuente)

`src/content/libros/La apologetica de Justino.mdx` tiene el body completamente
vacío. Al aplicar la política de contenido de libros
([`docs/libros/politica-de-contenido.md`](../libros/politica-de-contenido.md))
se descubrió que su `description` del frontmatter es casi idéntica,
palabra por palabra, a la de `Siempre Listos.mdx` ("Este libro es una
compilación de varias de las obras publicadas por el Dr. Bahnsen sobre
apologética cristiana..."), pero los autores reales de este libro son
K. Scott Oliphint y William Edgar (ya migrados a `authors:
["k-scott-oliphint", "william-edgar"]` y con perfil propio en
`/autores/`), no Greg Bahnsen — es evidente que la `description` se
copió por error del otro archivo y describe un libro distinto. No se
usó como fuente para generar un `## Sobre el libro` de relleno (se
prefiere un hueco documentado a un dato erróneo publicado).

**Qué se necesita:** confirmar con el usuario de qué trata realmente el
libro (título sugiere que es sobre la apologética de Justino Mártir),
corregir la `description` del frontmatter, y luego sí completar el
`## Sobre el libro`.

**Detectado:** 2026-08-04

## Biografía de José Ángel Ramírez — resuelta

~~Bio mínima, sin fuente pública verificable.~~ Al investigar la
atribución de autoría real del blog se encontró que dos posts
("La Creación Bajo Ataque" y "Charles Hodge: Un Proto-Presuposicionalista")
incluyen una bio en primera persona del propio Ramírez ("Lic. en estudios
teológicos del Miami International Seminary. Presbítero gobernante para
la Iglesia Betania de la Reforma..."). Se incorporó a
`src/content/autores/jose-angel-ramirez.mdx`.

**Detectado:** 2026-08-04 · **Resuelto:** 2026-08-04

## Atribución de autoría real en el blog (traducciones)

Se agregó el campo opcional `authors` (slugs de `/autores`) al schema del
blog y se enlazó `BlogPost.astro`/`AuthorCard` para mostrar la bio real
del autor cuando el post lo tiene, en vez de la voz genérica del equipo.
Se confirmaron y marcaron 28 posts que citan explícitamente a su autor
(un "Por: ..." o "Sobre el autor" al inicio o cierre del cuerpo) y que
ya tienen perfil en `/autores`: la mayoría de la serie "respuesta a Dr.
Fesko" y varios ensayos sueltos de James N. Anderson, varios extractos
de Greg Bahnsen, Cornelius Van Til, John Frame, K. Scott Oliphint,
William Edgar y José Ángel Ramírez.

Al hacer ese barrido completo del blog se encontraron **otros posts con
un "Por: ..." igual de explícito, pero de autores que todavía no
existen en `/autores`**. Se dejaron con la voz editorial genérica
porque agregar su perfil implica investigar y redactar su bio (una
decisión de contenido más grande que esta tarea):

- **Vern S. Poythress** — 4 posts: "Los Milagros de Cristo", "Acercándose
  a los «Problemas» Bíblicos", "La Biblia y la Ciencia", "Instrucción
  Divina versus Autonomía". Ya existe el tag `poythress` (7 posts), así
  que sería un autor con perfil propio bien justificado.
- **José Grau** — "Las actitudes Liberales y Neo-Ortodoxa frente a la
  Revelación".
- **John B. King Jr.** — "Una Metafísica Trinitaria de la Predestinación
  y Libertad Humana".
- **Mike Robinson** — "Greg Bahnsen: Epistemología y Ontología".
- **Stephen C. Perks** — "La Base Epistemológica de la Fe Cristiana".
- **Rev. P. Andrew Sandlin** — "La soberanía de Dios y la apologética".
- **Rev. Brian M. Abshire** — "Razón Evidencia y Apologética
  Presuposicional".
- **Joseph P. Braswell** — "La Filosofía de Gordon Clark".
- **Dr. Gary Demar** — "¿Debe Pedir Disculpas el Apologista por lo que
  Cree?".
- **Eric Svendsen** — "¿30.000 denominaciones protestantes?".

También quedó sin atribuir, por prudencia, **"La Controversia Gordon
Clark y Cornelius Van Til"**: cita a "Jared Moore" a media página en un
post largo y compuesto de varias fuentes, así que no está claro que sea
autoría única de todo el post (a diferencia de los 28 casos ya
atribuidos, donde el "Por:" aparece al inicio/cierre del cuerpo como
firma de la pieza completa).

**Qué se necesita:** decidir si se amplía el roster de `/autores` con
alguno de estos nombres (Poythress es el candidato más claro dado el
volumen de contenido suyo ya en el sitio) y, si es así, investigar y
redactar su bio siguiendo el mismo proceso usado para los 12 autores
actuales.

**Detectado:** 2026-08-04
