# Índice de conocimiento

Scripts que mantienen `src/data/knowledge.json`, el índice del que salen las
búsquedas precalculadas del menú ⌘K (`/search-presets.json`) y, más
adelante, los artículos relacionados y la vista `/grafo`. El índice se
genera del lado del desarrollador (un LLM lee los artículos). El sitio
solo lee el JSON.

## Flujo

1. **Build**: `bun run build`. Los scripts leen los ids reales de los
   encabezados en `.vercel/output/static/` para validar los anchors.
2. **Preparar**: `bun run knowledge:prepare`. Detecta los artículos
   publicados que faltan en el índice o cambiaron desde que se procesaron
   (comparando el hash de `sources`), y los reparte en lotes en
   `scripts/knowledge/.work/`. Con `--all` reprocesa todo.
3. **Procesar cada lote**: un agente (o una persona) sigue
   [`SPEC.md`](./SPEC.md) y deja `.work/batch-N.json`. Los lotes son
   independientes y se pueden procesar en paralelo.
4. **Mezclar**: `bun run knowledge:merge` para simular y revisar
   `.work/merge-report.txt`. Si hay consultas duplicadas entre lotes, se
   agregan a `QUERY_MERGES` en `merge.ts`. Después, `bun run knowledge:merge --write`.
5. **Validar**: `bun run knowledge:check`. Falla si algún fragmento no es
   literal, si un anchor o una referencia no existe, o si una consulta
   repite artículo.

Al reprocesar un artículo se reemplaza lo que el LLM había generado para
él. Lo corregido a mano (`origin: "manual"`) nunca se toca.

`.work/` es temporal y está en `.gitignore`. Los problemas de contenido
que anotan los lotes quedan al final de `merge-report.txt`. Los que
merezcan seguimiento se pasan a `docs/pendientes/contenido.md`.
