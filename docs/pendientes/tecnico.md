# Pendientes técnicos

## `markdown.remarkRehype` (y `remarkPlugins`/`rehypePlugins`) deprecados en Astro

- **Archivo:** `astro.config.mjs`
- **Qué falta:** Astro 7 marca `markdown.remarkPlugins`, `markdown.rehypePlugins` y `markdown.remarkRehype` como deprecados (warning visible en cada build: *"Pass them to `unified({...})` from `@astrojs/markdown-remark` directly instead"*). Hoy se usan para fijar `footnoteLabel: "Notas"` y `footnoteBackLabel` de las notas al pie.
- **Qué se necesita:** cuando Astro publique la API de reemplazo (`markdown.processor` + `unified()` manual) de forma estable, migrar la configuración. No es urgente — sigue funcionando, solo hay que revisarlo antes de una migración mayor de Astro.
- **Detectado:** 2026-08-03

## `astro preview` no soporta el adapter de Vercel

- **Archivo:** N/A (limitación de `@astrojs/vercel`)
- **Qué falta:** `npx astro preview` falla con *"The @astrojs/vercel adapter does not support the preview command"*. Para probar un build de producción localmente hay que servir `dist/client` con otra herramienta (ej. `npx serve dist/client`) o usar `vercel dev`.
- **Qué se necesita:** nada que arreglar — es una limitación conocida del adapter. Dejar documentado para no perder tiempo la próxima vez que alguien intente `astro preview`.
- **Detectado:** 2026-08-03
