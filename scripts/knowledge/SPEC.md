# Procesar un lote del índice de conocimiento

Instrucciones para quien procese un lote (un agente o una persona). Todas
las rutas son relativas a la raíz del proyecto.

Proyecto: blog de apologética reformada presuposicional, en español. El
índice vive en `src/data/knowledge.json` (esquema:
`src/data/knowledge.schema.ts`). LÉELO primero para calibrar estilo y
calidad, y para conocer las consultas y conceptos que ya existen.

Archivos de apoyo en `WORK` = `scripts/knowledge/.work/` (los genera
`bun run knowledge:prepare`):

- `batches.json`: los lotes; el lote N es el elemento N (desde 1).
- `manifest.json`: cada artículo publicado con `ref`, `file`, `title`, `anchors` (ids reales de encabezados en el HTML).
- `articles-index.json`: ref + título + descripción + tags de todos los artículos publicados (para relacionar con artículos fuera de tu lote).

## Qué hacer

1. Lee COMPLETO cada artículo de tu lote (campo `file` del manifiesto). No resumas de oídas.
2. Escribe `WORK/batch-<N>.json` con esta forma (N = tu número de lote):

```json
{
  "newConcepts": [ { "id": "kebab-case", "label": "...", "aliases": [], "description": "1–2 frases", "tag": "opcional, tag existente" } ],
  "conceptDescriptions": { "<id de concepto del vocabulario sin descripción>": "1–2 frases" },
  "edges": [ { "source": "blog:...", "target": "concepto:...|blog:...|autores:...|libros:...", "type": "trata|desarrolla|responde-a|critica|cita|relacionado", "weight": 0.0-1.0, "origin": "llm", "evidence": "cita literal breve del artículo fuente" } ],
  "queryAdditions": [ { "queryId": "<id de query existente en knowledge.json>", "results": [ { "ref": "blog:...", "anchor": "opcional", "snippet": "...", "origin": "llm" } ] } ],
  "newQueries": [ { "id": "kebab-case", "text": "pregunta como la escribiría un lector", "aliases": [], "concept": "opcional", "results": [ { "ref": "...", "snippet": "...", "origin": "llm" } ] } ],
  "issues": [ "problemas de contenido que veas: texto de prueba, descripción que no corresponde, notas rotas, MDX raro..." ]
}
```

## Reglas

- **Fuentes**: `source` de cada arista y `ref` de cada resultado deben ser artículos DE TU LOTE (son los que leíste). El `target` de una arista `relacionado`/`desarrolla`/`responde-a`/`critica` puede ser cualquier artículo de `articles-index.json` si la relación es clara por lo que leíste + su descripción.
- **Por artículo**: 2–5 aristas `trata` a conceptos; `cita` a `autores:<id>` o `libros:<id>` solo si el artículo es de/cita sustancialmente a ese autor/libro; 1–3 aristas entre artículos cuando haya relación real (prefiere `desarrolla`/`responde-a`/`critica` a `relacionado` cuando aplique).
- **Snippets y evidence**: copia LITERAL del artículo (puedes cortar con "…" entre fragmentos literales), máx. ~220 caracteres. Se validará con un script que compara texto normalizado: no parafrasees, no cambies comillas por otras.
- **Anchor**: solo ids que aparezcan en `anchors` del manifiesto para ese artículo, y solo si el fragmento está en esa sección.
- **Consultas**: piensa qué escribiría un lector en un buscador para llegar a cada artículo (preguntas naturales y términos, con alias: siglas, nombres, grafías, errores comunes). Si tu artículo responde una query existente de `knowledge.json`, usa `queryAdditions` en vez de crear una duplicada. 1–3 queries nuevas por artículo como máximo; cada una con 1–4 resultados ordenados (el mejor primero).
- **Conceptos**: usa el vocabulario de abajo. Crea `newConcepts` solo si ninguno encaja y el concepto es central en algún artículo (no más de 4 por lote).
- Pesos: `trata` 1 = tema central, 0.4 = tema secundario. `relacionado` = similitud temática.
- Tono: español neutro; nada de jerga inventada.
- No modifiques ningún archivo del repositorio. Solo escribe tu `batch-<N>.json`.
- Al terminar, valida que tu archivo es JSON válido (p. ej. `python3 -m json.tool`), y responde con un resumen de 3–5 líneas: nº de aristas, queries nuevas, adiciones, conceptos nuevos e issues.

## Vocabulario de conceptos

Los conceptos que ya existen (con descripción) son los de `concepts` en
`knowledge.json`: úsalos primero.

Propuestos que quizá aún no existan (si usas uno que no esté en
`knowledge.json`, propón su descripción en `conceptDescriptions`). Esta lista
debe coincidir con `SEEDS` en `scripts/knowledge/merge.ts`:

- cosmovision — Cosmovisión
- universales — El problema de los universales (el uno y los muchos)
- logica — Fundamento de la lógica
- absolutos-morales — Absolutos morales y ética
- problema-del-mal — Problema del mal
- escolasticismo — Escolasticismo y tomismo
- teologia-natural — Teología natural y luz de la naturaleza
- revelacion — Revelación general y especial
- ciencia-y-fe — Ciencia y fe
- creacion — Creación
- naturalismo — Naturalismo
- providencia — Providencia y soberanía de Dios
- milagros — Milagros
- lenguaje-religioso — Lenguaje religioso
- liberalismo-teologico — Liberalismo teológico
- denominacionalismo — Denominacionalismo
- sexualidad-y-genero — Ética sexual e ideología LGBT
- aborto — Aborto
- epistemologia-reformada — Epistemología reformada (Plantinga)
- ontologia-y-epistemologia — Ontología y epistemología
- dignidad-humana — Libertad y dignidad humana
- historia-de-la-apologetica — Historia de la apologética
- fe-y-razon — Fe y razón
- resurreccion — Resurrección
- dificultades-biblicas — Dificultades bíblicas
- agnosticismo — Agnosticismo
- metafisica — Metafísica
- trinidad — Trinidad

## Autores y libros

Los ids válidos son los nombres de archivo (sin extensión, pasados a
minúsculas con guiones) de `src/content/autores/` (`autores:<id>`) y
`src/content/libros/` (`libros:<id>`). El script de mezcla descarta
cualquier referencia que no exista.
