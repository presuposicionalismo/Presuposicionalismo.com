# Pendientes de contenido

## Notas al pie huérfanas (falta el texto original)

Tras estandarizar las notas al pie de todo el blog al formato `[^n]`, quedaron 3 posts con marcadores que no tienen texto de definición en ninguna parte del archivo (probablemente se perdió en una migración anterior, o el original nunca lo tuvo). Los 3 están en borrador (`draft: true`), así que no afectan el sitio publicado — pero hay que resolverlo antes de publicarlos.

- **`src/content/blog/Dos Guerreros Cristianos_ Cornelius Van Til y Francis A. Schaeffer comparados.mdx`** — 81 notas (`[^1]` a `[^81]`) sin ningún texto de definición. Se revisó el historial de git hasta el commit original y ya carecía de la lista. Probable fuente: _"Two Christian Warriors: Cornelius Van Til and Francis Schaeffer Compared"_ de William Edgar.
- **`src/content/blog/La Controversia Gordon Clark y Cornelius Van Til.mdx`** — notas 50, 81, 101 y 116 no tienen marcador en el cuerpo (definición huérfana, no se sabe a qué frase corresponden exactamente).
- **`src/content/blog/El Problema De Conocer Lo «Sobrenatural».mdx`** — notas 40, 41 y 42 sin texto. La 41 probablemente corresponde a una cita de W. H. Walsh y la 42 a una cita de Nietzsche (_Más Allá del Bien y del Mal_).

**Qué se necesita:** localizar el texto/PDF original de cada artículo para completar las definiciones faltantes.

**Detectado:** 2026-08-03

## Notas al pie a confirmar (ya publicadas)

- **`src/content/blog/Venciendo el Prejuicio Anti-Metafísica.mdx`** — la nota 16 existe como definición pero no tiene marcador en el cuerpo (inofensivo, no se ve en la página, pero la cita "Bahnsen, Siempre Preparados, 184" queda sin vincular a ninguna frase).
- **`src/content/blog/¿Son la ciencia y la lógica neutrales y sin presuposiciones.mdx`** — las notas 9, 13 y 16 no tenían marcador visible en el original; se ubicaron por coincidencia de contenido (Sproul/_Knowing Scripture_, lista de contrastes de Grant, referencia a Simon Kistemaker respectivamente). Vale la pena confirmar que quedaron en el lugar correcto. La nota 31 no tenía definición en ninguna parte del original — se quitó el marcador en vez de dejar una referencia rota visible.

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

## Revisión de contenido al generar el índice de búsqueda

Al construir `src/data/knowledge.json` (búsquedas precalculadas y grafo) se
leyeron completos los 70 artículos publicados. Estos son los problemas de
contenido que se anotaron de paso: autoría, descripciones que no
corresponden, errores de traducción que invierten el sentido, MDX o
maquetación rota, enlaces viejos. No se corrigió ninguno; varios requieren
el texto original para decidir.

- blog:lógica («Lógica: ¿El último refugio?») reproduce la sección homónima de blog:son-la-ciencia-y-la-lógica-neutrales-y-sin-presuposiciones: contenido duplicado entre dos artículos.
- ¿Son la ciencia y la lógica neutrales…: quedan tres comentarios {/_ FOOTNOTE-REVISAR _/} sobre las notas 9, 13 y 16 (posición del marcador sin verificar), y se quitó el marcador de la nota 31 (cita de Ramm), cuya definición falta.
- ¿Son la ciencia y la lógica neutrales…: el párrafo sobre la lógica india está corrupto («variedades nistóteles (p. ej.,"No amará") o paryudasa (p. ej.,"No amará" o "No amará")»; debería ser prasajya/paryudāsa con ejemplos distintos). También «encontramos invariabilidad incuestionable» debería decir «variabilidad», «eisogenia» → «eiségesis», y «Volviendo a la Biblia» está en negrita en vez de encabezado.
- Las Contradicciones Inherentes al Agnosticismo: «razonaría analógica y unívocamente» contradice a Van Til (el original dice que razonaría analógicamente y no unívocamente). Las notas son de Bahnsen (Van Til's Apologetic), pero solo figura Van Til como autor. Los encabezados llevan el número de nota pegado, por lo que los anchors salen como «…agnosticismo8», «…epistemologicos4», «…contrarias1».
- Las Presuposiciones son la Clave: las secciones «LAS PRESUPOSICIONES COMO PUNTO BÁSICO DE REFERENCIA» y «EL CRISTIANISMO NO ES UNA HIPÓTESIS ENTRE MUCHAS OTRAS» son texto plano en mayúsculas, no encabezados (sin anchors). Hay espacios sobrantes tras comillas (" presuposiciones") y «los " gafas de color"» (género).
- Presuposicionalismo y evidencia - Parte 1: dos líneas horizontales (---) seguidas bajo el primer encabezado; queda un «26» suelto (número de nota del original de Kruger) dentro de la cita; las notas 5–9 dicen «Ibid» (Van Til) pero citan a Oliphint; las citas de Kruger no tienen referencia bibliográfica; la nota 3 tiene la URL con errata «nuetra»; varias tildes faltantes («articulo», «metodo», «Esta divorciado», «en si»). No existe parte 2 publicada.
- Ciencia - Una celebración y un lamento: el autor (Vern Poythress) aparece como línea de texto suelta y no hay campo authors; nota 3 con errata en el título del libro («Probably» → «Probable»); la descripción habla de la «incapacidad de la ciencia» para reconocer a Dios, cuando el artículo atribuye la ceguera al corazón humano, no a la ciencia.
- La incoherencia de los LGBT - parte 2: el enlace a la parte 1 apunta a https://presuposicionalismo.com/la-incoherencia-de-los-lgbt/ (URL antigua; hoy es /blog/la-incoherencia-de-los-lgbt/); el enlace final conserva un parámetro de rastreo fbclid; heroImage duplicado en un comentario; «sectores del evangelismo» debería ser «evangelicalismo». Las descripciones de ambas partes terminan con un espacio sobrante.
- blog:razón-evidencia-y-apologética-presuposicional: los números de las notas aparecen pegados al texto como dígitos sueltos, sin sintaxis de nota al pie ("defensa de algo1", "los griegos.8″", "credibilidad de la fe cristiana.2″."), con signos ″ (doble prima) sobrantes; las notas 7, 53, 55 y 56 no se citan en el cuerpo y la lista final no es de notas MDX.
- blog:razón-evidencia-y-apologética-presuposicional: errores menores: "Heizenberg" (Heisenberg), "Van Till" en las notas, "Rms 1:20" citado para "Profesando ser sabios, se convirtieron en tontos" (es Rom 1:22), "compuesta compuesta" repetido.
- blog:el-problema-de-los-universales: la línea "Por: Greg Bahnsen" y authors: ["greg-bahnsen"] no parecen correctas; el texto es del cap. 11 de «¡Prepárate para la Buena Batalla! La Metodología Apologética de Greg L. Bahnsen» (Pushing the Antithesis, de Gary DeMar), que habla de Bahnsen en tercera persona y lo cita en nota.
- blog:el-problema-de-los-universales: markdown roto en "**2*. La Coherencia del Mundo*.**"; en la nota 21 dice "Ciado" (Citado); en la nota 1 queda "Zen Buddhism" sin traducir; la nota 3 y los URLs tienen espacios y escapes rotos ("http://www. reformed.org", "http:// www.animallaw.info").
- blog:la-creación-bajo-ataque: el crédito del autor aparece dos veces ("#### Por: José Ángel Ramírez" con biografía y luego "## Por: José Ángel Ramírez.", que además genera el anchor duplicado por-josé-ángel-ramírez-1), con el nombre de la revista escrito distinto ("7 Minutos del Calvinismo" / "7 Minutos de Calvinismo").
- blog:la-creación-bajo-ataque: erratas: "comunicaciónsería", "susdeseos", "empezará" (empezara), "ellas es el todo"; en la cita de la CFW 4 dice "Agrado a Dios" y "creo al hombre" (Agradó, creó); la nota 1 tiene un URL con un espacio y un parámetro de seguimiento fbclid.
- blog:fue-calvino-escolastico-una-respuesta-dr-fesko: en la cita de Fesko (pp. 66-67) dice "Además, según Van Til, usando la distinción de las dos inteligencias, Calvino creía..."; por el contexto debería ser "según Calvino" o se trata de un error de traducción. Quedan "[Calvin]" sin traducir y una referencia a "la cita de la p. 52" de Van Til que el artículo nunca muestra.
- blog:la-impropiedad-de-argumentar-evidencialmente-por-la-resurrección: el frontmatter no tiene authors aunque el texto es de Greg L. Bahnsen. Hay errores de traducción: "El cristiano que se disculpa" (the Christian apologist), "argumentos evidentes" (evidenciales), "factibilidad" (facticidad).
- blog:30000-denominaciones-protestantes: hay calcos del inglés: "Sin embargo, Barrett ha definido 'denominación'..." (However Barrett has defined = comoquiera que Barrett defina), "citar figuras erróneas" (cifras), "Christo-Pagans" sin traducir. El artículo no tiene subtítulos (solo un H2 igual al título) y no nombra a Eric Svendsen en authors.
- blog:van-til-contra-aristóteles: aparece un encabezado "### Imagen aqui" que ocupa el lugar de un diagrama que falta (el de los dos círculos) y genera el anchor imagen-aqui. Hay errores de traducción: "no discuto que Van Til tenga razón" (en el original es "no estoy argumentando que", y el sentido queda invertido), "Apología Reformadora" (Reforming Apologetics), "Thomas comienza" sin traducir, "forma de remoción" (via remotionis). La segunda cita de Van Til (El Pastor Reformado, p. 87) está gramaticalmente rota. Faltan tildes: "Aristoteles", "revision", "ingles", "aqui".
- blog:van-til-contra-aristóteles: es un fragmento de la misma reseña de Anderson (proginosko.com/2019/08/reforming-apologetics-thomas-aquinas) que probablemente es la fuente de blog:ha-leído-mal-van-til-a-aquino-una-respuesta-a-dr-fesko; conviene revisar si hay contenido duplicado entre ambos.
- blog:ganar-el-mundo-con-esperanza: la descripción del frontmatter exagera el contenido: habla de "compromiso cultural", de "influir positivamente en el mundo" y de la "soberanía de Dios sobre todas las cosas", pero el artículo trata de la esperanza en la resurrección como contenido de la defensa (1 Pe 3:15). Justo después de la cita de 1 Pedro 3:15 quedó pegada una cita destacada ("Una de las verdades más poderosas...") que se repite más abajo. Las comillas de la cita inicial están mal cerradas ("Tu Dios no puede existir". Si lo hiciera..."). La frase "La futilidad de nuestra fe se ve frustrada" es confusa.
- blog:venciendo-el-prejuicio-anti-metafísica: el cuerpo cita a Bahnsen en tercera persona («Bahnsen, Siempre Preparados», URLs consultadas en 2013) aunque la firma dice «Por: Greg Bahnsen» (murió en 1995); el libro «¡Prepárate para la Buena Batalla!» (Pushing the Antithesis) fue editado por Gary DeMar a partir de material de Bahnsen. Conviene aclarar la autoría.
- blog:venciendo-el-prejuicio-anti-metafísica: dice «Considera los siguientes siete problemas» pero enumera ocho; «problemas con la posición metafísica» debería ser «antimetafísica»; «las afirmaciones metafísicas son contradictorias en sí mismas» (punto 6) debería decir antimetafísicas.
- blog:venciendo-el-prejuicio-anti-metafísica: restos de guiones de maquetación del PDF («Escri-\ntura», «auto-afirma-ción», «acechan do»), falta el marcador de la nota 16 (hay comentario FOOTNOTE-REVISAR en el MDX), «Esta operando» sin tilde y «sobe» por «sobre».
- blog:lógica: errores de traducción: «nistóteles» (debería ser prasajya) y los ejemplos repetidos «No amará»; frase ininteligible «La lógica del precio paga por su objetivo, establecido, y cierto estatus…»; «¿cuáles son las verdades lógicas?» aparece dos veces seguidas (la primera debería ser «¿qué son…?»); «encontramos invariabilidad incuestionable» debería ser variabilidad; «Desacuerdo de rango»; «logistas» por lógicos; «sincategormáticos».
- blog:lógica: el título y el único encabezado se repiten (H2 «Lógica: ¿El último refugio?» igual al título); es un extracto sin introducción ni conclusión cristiana, lo que se podría indicar (procede de un trabajo más largo de Bahnsen).
- blog:ha-leído-mal-van-til-a-aquino-una-respuesta-a-dr-fesko: errores de traducción: «Apología Reformadora» (debe ser «Reformando la Apologética»), «¿No es eso una pregunta atroz?» (begging the question = petición de principio), «Al ritmo de Van Til» (contra Van Til), «poner agua azul clara» (blue water = marcar distancia), «Revision del 4to capitulo» sin tildes.
- blog:la-paideia-tomista: la descripción dice que el artículo «defiende que este enfoque proporciona una base sólida para el conocimiento y la moralidad», pero Van Til lo critica como síntesis no cristiana de «Aristóteles más Cristo»; la descripción es errónea.
- blog:la-paideia-tomista: faltan espacios («empírico.Con», «entre sí.Usar»), «Thomas argumenta» sin traducir, «Tomas» sin tilde varias veces, «sólo puede existir la que está» (lo que), «Papa León 13» (León XIII).
- blog:\_definiendo-las-cosmovisiones: muchas palabras pegadas («imposiblede», «cosmovisionesy», «tresminutos», «el“arrebatar”», «términonos», «sencilla“Presuposicionalismo.”», «demanera», «versículode», «llevoa», «creenciasfundamentales», «teencontrarás», «unenfoque»); no tiene campo authors en el frontmatter; «sistema independiente de creencias» y «declaraciones autónomas» parecen errores de traducción (interdependientes / autoritativas).
- blog:\_definiendo-las-cosmovisiones: firma «Por: Greg Bahnsen» pero cita «Bahnsen, Siempre Preparados» en tercera persona y a DeMar (libro editado por Gary DeMar); igual que en Venciendo el Prejuicio Anti-Metafísica.
- blog:greg-bahnsen\_-epistemología-y-ontología: el autor es Mike Robinson (firma «Por Mike Robinson» y promociona su libro), no Bahnsen; la descripción («según Greg Bahnsen… Bahnsen argumenta») y el nombre de archivo lo atribuyen a Bahnsen. No tiene campo authors.
- blog:la-biblia-y-la-ciencia: enlace roto en Lecturas adicionales: «https://seanmcdowell.org/src/assets/coverblog/responding-to-a-dangerous-ideology-…» (parece un reemplazo masivo de /blog/ por /src/assets/coverblog/); el autor (Vern Poythress) no está en la colección de autores ni en authors; hay un separador «---» duplicado al inicio.
- blog:el-libro-de-la-naturaleza-y-la-apologética\_-una-respuesta-al-dr-fesko: sin byline ni `authors` en el frontmatter (es la reseña del cap. 8 de James N. Anderson, como las otras de la serie) y sin enlace al original en proginosko.com; erratas «thelos» por «telos» y «los vantilianos exclamará».
- blog:el-problema-del-mal: el texto es de Greg Bahnsen (Siempre Listos) pero el frontmatter no tiene `authors: ["greg-bahnsen"]`; errata «(incluya con la ayuda de computadoras.)» por «incluso».
- blog:hace-van-til-con-kant-lo-mismo-que-señala-que-hizo-aquino-con-aristoteles-una-respuesta-a-dr-fesko: el título dice «Van Til no hizo con Kant…» pero el archivo/ref dicen «¿Hace Van Til…?»; la descripción empieza exponiendo la postura de Fesko como si fuera la del artículo y termina sin punto; traducción literal «lo que es salsa para el ganso es salsa para el ganso».
- blog:la-apologética-de-justino-mártir: la tabla de contenido manual enlaza a #justino-mártir, que no está entre los anchors del manifiesto (h1 dentro del cuerpo); enlace MDX raro «[\n\nIr a catalogo de libros](…)»; «Justino y la idea del Logos» es un párrafo suelto que debería ser encabezado; errores de traducción: «logotipo(s)» por «logos», «porquismo», «Zenón de Chipre» (de Citio), «se haya convertido a Éfeso», «Justin». Además, la ficha libros:la-apologetica-de-justino tiene copiada la descripción de Siempre Listos (habla de Bahnsen).
- blog:negó-van-til-el-concepto-histórico-de-luz-de-la-naturaleza-una-respuesta-a-dr-fesko: errata «presuposicionismo» por «presuposicionalismo».
- blog:definición-de-las-posiciones\_--la-fe-la-razón-y-la-fe-racional: el blockquote atribuido a «Cornelius Van Til» contiene en realidad texto del autor (Warren), mientras la cita real de Van Til (el hombre de agua y la escalera) no está formateada como cita; falta `authors: ["michael-warren"]`; queda el marcador «\[....\]» tras el título del ensayo; enlace MDX raro «[\n\nIr a nuestro catalogo](…)»; cita de Twain sin comillas de cierre; «Nietzche».
- blog:debe-pedir-disculpas-el-apologista-por-lo-cree: el autor (Gary DeMar, escrito «Demar») no tiene ficha en autores; pie de imagen suelto «Pablo en la colina de Marte… por Rafael (1515).» sin imagen; el slug del frontmatter es «…por-lo-cree» (falta «que»), distinto de la URL del manifiesto; nota 1 traduce «Foundations of Christian Scholarship» como «Fundamentos de la beca cristiana»; «propuesta de piedra angular» (¿proposición?).
- blog:la-teología-reformada-y-la-apologética-clásica: el texto está truncado al final («ocupa su lugar entre todos los demás» sin terminar) y empieza in medias res («este método apologético», «Greene» sin presentar); la cita de Muller está mal maquetada (la primera cita va en el párrafo y «Y así, dice Muller,» queda dentro del blockquote); marcado «original» pero parece un fragmento traducido sin autor; la descripción menciona la soberanía de Dios, que el texto no trata.
- blog:dios-no-es-la-inferencia-de-la-ciencia-es-su-presuposición: la description del frontmatter empieza repitiendo el título pegado a la frase siguiente («...es su PresuposiciónEste artículo...»).
- blog:dios-no-es-la-inferencia-de-la-ciencia-es-su-presuposición: las notas empiezan en [^23] (extracto de libro sin renumerar); «agistrat absoluta» y «agistrat agistra» están corruptos (debería ser potentia absoluta / potentia ordinata); errata «Galielo Galilei», «Biblical Originis»; «\[entonces)» con corchete mal cerrado; muchas citas en bloque están envueltas en «\_“…”\_» (guion bajo escapado, se ve literal en vez de cursiva); el autor aparece como línea suelta «Vishal Mangalwadi.» bajo el primer H2 en lugar de byline; nota 37 atribuye la Declaración de Independencia a la «Constitución de Estados Unidos».
- blog:el-problema-de-la-uniformidad-de-la-naturaleza: «Bing Bang» en vez de «Big Bang» (4 veces); traducción de Russell invertida: dice que el principio de inducción «tiene un fundamento en la observación», cuando el sentido es que no lo tiene; «ontología\_\_» con guiones bajos escapados sueltos; frase agramatical «Este punto demuestra que todos y cada uno de los intentos de demostrar que la uniformidad… requiere»; citas sin fuente en notas; el libro citado es de Joel McDurmon sobre la metodología de Bahnsen, aunque la byline dice «Por: Greg Bahnsen».
- blog:sostuvo-van-til-una-creencia-no-reformada-sobre-la-cosmovisión-una-respuesta-a-dr-fesko: errata «Reformado la Apologética»; cita «(p. 11)» probablemente es p. 110; «Pronunciamiento 1» (traducción de «Claim 1») no coincide con «Primer punto» usado antes; frase «Aunque nunca usa el término específico de cosmovisión» es confusa (el original se refiere al término inglés «worldview»); byline al final del texto.
- blog:la-base-epistemológica-de-la-fe-cristiana: nota 7 cita «A Survey of Christian Knowledge» (debería ser A Survey of Christian Epistemology); «Tomado del primero capítulo»; nota 8 cierra comillas sin abrirlas.
- blog:la-soberanía-de-dios-y-la-apologética: probable error de traducción: «los apologistas presuposicionales no disputan que la historia… demuestran que el cristianismo es "probablemente" verdadero» (el sentido debería ser que no argumentan eso); errata «sugiera» por «sugiere».
- blog:las-actitudes-liberales-y-neo-ortodoxa-frente-a-la-revelación: referencias «(op. Cit., p. 337)» y «(op. Cit., p. 346)» sin obra citada previamente; encabezados de lista con ###### y espacio final; «arbitro» sin tilde; «para «conozcamos»» falta «que».
- blog:la-futilidad-del-pensamiento-no-cristiano: sin autor ni fuente (etiquetado 'original', pero parece traducción de un ensayo presuposicional); «a lá» por «à la»; «(p. 2 88)», «(p. 28).)», puntos pegados «colapsa.De», «(p. 26)\n\n.Obviamente»; cita de Kurtz sin cerrar comillas («Hay fallas en la naturaleza y hay casualidades..Además»); «auto-vicio» parece mala traducción.
- blog:el-problema-del-lenguaje-religioso: la descripción (comunicar lo divino con lenguaje finito; significado basado en la revelación) no corresponde al contenido, que refuta el verificacionismo (Ayer) y el falsacionismo (Flew) mostrando que se autorrefutan. El artículo no acredita autor (tag 'frame', pero parece de Bahnsen, cita a Frame).
- blog:el-problema-del-lenguaje-religioso: tabla de contenidos manual con enlaces '#¿tiene-sentido-hablar-de-dios' que no coinciden con los ids reales ('tiene-sentido-hablar-de-dios'); H2 duplicado del título y dos '---' seguidos al inicio. Nota [^5] (Popper) colocada tras la parábola de Flew/Wisdom, no corresponde. Erratas: 'experiencia human a', comilla sin cerrar en '"¡Ay!', 'Vera pasada dallies nevar'.
- blog:el-problema-del-lenguaje-religioso y blog:experiencia-y-creencia comparten texto casi idéntico (red de creencias, ejemplo de la mariquita, psiquiatra y el hombre muerto): posible contenido duplicado.
- blog:libertad-personal-y-dignidad-humana: el extracto es de un libro de Kenneth Gentry sobre Bahnsen ('¡Prepárate para la Buena Batalla!') y no se acredita autor. Erratas de traducción: 'Derek Kínder' (Kidner), 'David Baltimore, un Nobel de literatura' (fue Nobel de medicina), 'Davis reconoce' (Davies), 'la creación del Día 5' (debe ser Día 6), 'carece de cualquier correspondencia con las actividades humanas' (debería ser animales), 'del biogenético, Dinesh D’Souza' confuso; nota [^21] empieza con '4 Bertrand Russell'; 'adn' en minúsculas.
- blog:el-aborto-un-crimen-contra-dios-y-la-humanidad: las llamadas a notas son dígitos pegados al texto ('covid-191', 'abortos2', 'de 20133', 'lo es.4') en lugar de [^n]; la lista de notas final junta la 2 y la 3 en una línea. Blockquote con residuo '\_ >' antes de Salmos 139, cita truncada 'Salmos 139: 13-1;'. 'traduccionistas' debería ser 'traducianistas'. Frontmatter con '##heroImage'. Nota 7: '(New York: Cita del, 1957)' (Citadel). Afirma que Jesús era 'considerado como una vida' antes de ser puesto en el vientre, frase confusa.
- blog:la-filosofía-de-gordon-clark: cursiva rota '\_fundacionalismo, coherentismo o contextualism_o'; palabras pegadas 'veracitasDei', 'sensusdeitatis'; la URL de la fuente original contiene un parámetro fbclid con 'neutral' incrustado (posible reemplazo masivo accidental).
- blog:teismo-biblico: no acredita autor (es de Van Til, tesis 'The Will in Its Theological Relations'); título sin tildes ('Teísmo Bíblico'); la descripción termina sin punto. Cita neerlandesa de Kuyper truncada y comilla sin cerrar ('...uit zijn natuur, krachten "La antítesis'); párrafo roto 'Parece que este es el profesor Flint / El error de Flint'; notas como números sueltos (1, 2, 3, 5) sin enlaces, notas 4 y 6 no referenciadas; 'Archimedian που στω', 'sentido embarazoso', 'mediodía' (probable mala traducción de 'datum'); las notas del traductor traducen mal el neerlandés.
- blog:los-milagros-de-cristo: la descripción menciona 'invitando a los creyentes a confiar en el poder transformador de Cristo', que el texto no desarrolla; el ensayo es un resumen breve de TGC con secciones de un solo párrafo.
- blog:dudas-de-william-lane-craig-sobre-el-relato-de-la-creación: el autor es Peter J. Leithart (solo aparece al pie); la descripción habla de 'apologética reformada' y 'tradicionalismo reformado', encuadre que el texto no usa (critica la hermenéutica de Craig desde la tradición interpretativa general).
- blog:falacia-de-petición-de-principio-en-el-razonamiento-ateo: errata en la cita de Stein 'evocar o sobrenatural' (lo sobrenatural); la cita de Stein abre sin comillas pero cierra con ”.
- como-reducir-las-presuposiciones-cristianas-al-absurdo: el slug dice «presuposiciones-cristianas» pero el título y el contenido son sobre presuposiciones NO cristianas; el slug invierte el sentido.
- como-reducir-las-presuposiciones-cristianas-al-absurdo: la sección «REDUCIENDO LAS PRESUPOSICIONES NO CRISTIANAS AL ABSURDO» es un extracto de Van Til (Survey of Christian Epistemology, 203-8, según nota 23), pero el artículo solo firma «Por: Greg L. Bahnsen» y no hay blockquote que lo marque; también las citas de Van Til de los párrafos «Ya que en la base reformada…» y «El método de razonamiento empleado…» aparecen como texto normal, sin formato de cita.
- como-reducir-las-presuposiciones-cristianas-al-absurdo: errata «pou std» (debería ser «pou sto», como dice la nota 10).
- las-precondiciones-teístas-del-conocimiento: la descripción dice que trata sobre la uniformidad de la naturaleza y la lógica, pero el artículo trata de la normatividad epistémica (garantía, deber, función adecuada) frente al naturalismo, platonismo, panteísmo y panenteísmo; no menciona la uniformidad ni la lógica.
- las-precondiciones-teístas-del-conocimiento: error de traducción «el aspecto trascendente… serviría (en algún aspecto) como norma, mientras que el aspecto inmanente serviría como norma» (el segundo debería ser «lo normado»). Además, Kim se cita como 1988 y luego como 1998 (la bibliografía dice 1988).
- pruebas-teístas: restos de shortcode de WordPress «\[su_spoiler …\]…\[/su_spoiler\]» y una tabla de contenidos manual; el título «Evaluación general de las pruebas teístas» quedó pegado dentro de un párrafo («…Diseñador.Evaluación general de las pruebas teístasLas pruebas…»), faltan espacios tras punto en varios sitios y hay duplicado «Y dijo Dios: " Y dijo Dios:». El frontmatter no tiene authors (Poythress). La descripción menciona el argumento moral, que el artículo no trata.
- liberalismo-y-fundamentalismo-teológico: el entrevistador aparece como «Defensa de la Fe» y «Defendiendo la Fe» indistintamente; «Prof. Nicodemo» en vez de «Nicodemus»; errata «fudamentalismo». La descripción presenta el fundamentalismo solo en positivo, pero el entrevistado también critica su separatismo. El tag «denominacionalismo» encaja poco. No tiene authors en el frontmatter.
- van-til-y-plantinga-más-cerca-de-lo-que-parece: en el frontmatter quedó la línea «#heroImage: "/default.jpg" falta realmente» (comentario con texto suelto).
- acercándose-a-los-problemas-bíblicos: erratas en encabezados «Tres Aspectos del Desafió» y «Examinado la situación/nuestras actitudes» (de ahí salen los anchors); «Mateo (22:37-40)» mal colocado; «Debemos resistir con impaciencia y superficialmente decidir» invierte el sentido (debería ser resistir la tentación de decidir con impaciencia); menciona recursos de Warfield y DeYoung «abajo» que no existen en el artículo. Sin authors en el frontmatter. En el working tree se le quitó «draft: true».
- la-personalidad-y-el-desafío-del-naturalismo: sin authors en el frontmatter (Poythress; traducido por José Ángel Ramírez).
- características-de-la-cosmovisión: fechas erróneas («Auguste Comte, 1709–1857», debe ser 1798; «D. M. Baillie (1857–1954)», debe ser 1887) y citas bíblicas inexistentes o erradas («Deuteronomio 33:37», «Hebreos 11:13» por 11:3, «Isaías 46:19», «Salmos … 40:21–26» que es Isaías 40).
- características-de-la-cosmovisión: la definición de metafísica abre comillas «“El estudio de la naturaleza fundamental…» y nunca las cierra; palabra partida «los mis mos»; la frase «la naturaleza trinitaria de Dios y muchas otras verdades divinas como esta, sí muestran que Dios existe» está mal traducida (dice lo contrario de lo que se quiere decir).
- el-problema-de-los-absolutos-de-la-moral: «Manifiesto Humanista III (1973)» debe ser II; la cita de Sartre dice «es muy angustiante que Dios si exista» cuando el sentido es «no exista»; «Salmos 1:25» no existe (probablemente 19:7); el cuerpo abre con un H1 «# Preocupaciones Centrales» que compite con el título; afirma que el sati es práctica funeraria hindú normal «en la actualidad», un dato falso.
- una-metafísica-trinitaria-de-la-predestinación-y-libertad-humana: «Por:John B. King Jr.» sin espacio y metido dentro de la sección «Resumen»; «utilizó» debe ser «utilizo»; las notas al pie siguen en inglés; queda el texto de la revista «Los autores no informaron ningún conflicto de intereses potencial».
- razonamiento-por-presuposición: errata «Does Cod Exist?» en la nota 4 (debe ser «Does God Exist?»); «el Dios autónomo» traduce mal «self-contained God» (dos veces), y resulta confuso en un sitio que critica la autonomía; las notas son comentario de Bahnsen en primera persona («Compare mis conferencias…») pero no se le atribuyen.
- la-apologética-clásica-es-inútil-frente-a-los-irracionalismos-orientales: el nombre del archivo y el ref no coinciden con el título ni con la URL («Van Til y Vivekananda…»); el H2 repite el título; faltan espacios («todo.Si», «afirmación:El», «Revelación.Los»); erratas «Disciplinar una nación» (discipular), «Empojando la antitesis» (Empujando la antítesis), «Cristopher», «George Whitfield» (Whitefield), «fisica»; la referencia temporal «El 12 de enero la India celebrará» ha quedado desfasada.
- el-presuposicionalismo-confunde-la-ontología-con-la-epistemología: la description del frontmatter no corresponde al contenido (resume otro texto de Anderson, sobre el conocimiento del incrédulo, en lugar de la objeción del orden del ser y del conocer); erratas «no interferencial» (no inferencial), «crist ianismo», «conciencia experimental» (experiencial) y «. objeta» en minúscula.
- instrucción-divina-versus-autonomía: empieza en medio de un argumento («Todas estas preguntas son importantes…») que alude a un contexto del libro que no se incluye; «estatus en la Biblia» debe ser «estatus de la Biblia».
- experiencia-y-creencia: tiene la etiqueta «original», pero el texto parece traducido de Greg Bahnsen (conviene verificarlo y atribuirlo); quedan referencias al inglés («uso de palabras en inglés», «la palabra inglesa "rose"»); paréntesis roto «(por ejemplo...), sobre…»; «mariquitas gentiles» es una traducción extraña; los párrafos van sangrados con 5 espacios y tienen espacios al final de línea.

**Qué se necesita:** revisión editorial, empezando por las autorías y las
frases que invierten el sentido del original.

**Detectado:** 2026-09-30
