# **Presuposicionalismo.com**

Un sitio web dedicado a promover la literatura y filosofía cristiana presuposicional, enfocándose en la metodología apologética del Dr. Cornelius Van Til y sus estudiantes. Destaca el trabajo de importantes "vantilianos" como Greg Bahnsen, John Frame, James Anderson y Scott Oliphint.

**Objetivo**: Bendecir a los visitantes y promover la gloria de Dios a través de contenido apologético de calidad.

- **Producción**: https://presuposicionalismo.com

## 🛠️ **Stack**

- **Framework**: [Astro](https://astro.build/) 7, con `output: "server"` y las páginas de contenido prerenderizadas
- **Componentes interactivos**: [Svelte](https://svelte.dev/) 5 y [bits-ui](https://bits-ui.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) 4 sobre tokens propios (`src/styles/tokens.css`)
- **Contenido**: MDX en colecciones de contenido con esquema (`src/content.config.ts`)
- **Búsqueda**: [Pagefind](https://pagefind.app/) + búsquedas precalculadas (`src/data/knowledge.json`)
- **Grafo**: [d3](https://d3js.org/) (disposición calculada en el build)
- **Deploy**: Vercel (`@astrojs/vercel`, Speed Insights)
- **Gestor de paquetes**: Bun

## ✅ **Qué hay en el sitio**

| Sección   | Ruta       | Contenido                                                          |
| --------- | ---------- | ------------------------------------------------------------------ |
| Portada   | `/`        | Últimas entradas, libros destacados y autores                      |
| Blog      | `/blog`    | 70 artículos publicados, paginados (3 más en borrador)             |
| Libros    | `/libros`  | 11 libros con ficha y descarga                                     |
| Autores   | `/autores` | 12 autores con biografía, sus libros y los artículos relacionados  |
| Etiquetas | `/tags`    | Artículos por etiqueta                                             |
| Mapa      | `/grafo`   | Grafo de conceptos, artículos, autores y libros con sus relaciones |
| RSS       | `/rss.xml` | Feed del blog                                                      |

Además:

- **Buscador ⌘K / Ctrl+K** en el blog y las etiquetas: combina respuestas precalculadas (la pregunta, los artículos que la responden y el fragmento exacto) con búsqueda de texto completo, y filtra por etiqueta o autor.
- **Dos pieles, cada una en modo claro y oscuro**: _Ledger_ (geométrica, monocroma) y _Grabado_ (editorial, papel envejecido). Ver la cabecera de `src/styles/tokens.css`.
- **SEO**: meta tags, Open Graph, datos estructurados (JSON-LD), sitemap y descripciones cortas por artículo (`seoDescription`).
- **Transiciones entre páginas** con `ClientRouter` de Astro.

Las rutas con guion bajo (`src/pages/_clases`, `src/pages/_about.astro`) están desactivadas.

## 🧠 **Índice de conocimiento**

`src/data/knowledge.json` (esquema en `src/data/knowledge.schema.ts`) describe los 70 artículos publicados:

- **Conceptos**: 49, con alias y descripción.
- **Relaciones tipadas**: 523. Un artículo _trata_ un concepto; puede _desarrollar_, _responder a_ o _criticar_ otro artículo, o _citar_ a un autor o libro.
- **Búsquedas precalculadas**: 104, cada una con sus resultados y el fragmento literal que responde.

De ahí salen el buscador ⌘K (vía `/search-presets.json`) y `/grafo`. El índice se genera del lado del desarrollador (un LLM lee los artículos) y se valida contra el contenido real: todo fragmento debe ser literal y todo anchor debe existir en el HTML. El flujo está en [`scripts/knowledge/README.md`](./scripts/knowledge/README.md). Cuando se publica o se edita un artículo, `bun run knowledge:check` avisa de lo que falta actualizar.

## 🚀 **Desarrollo**

### **Prerrequisitos**

- [Bun](https://bun.sh/) (el repositorio usa `bun.lock`)

### **Configuración local**

```bash
git clone https://github.com/presuposicionalismo/Presuposicionalismo.com.git
cd Presuposicionalismo.com
bun install
bun run dev
```

La búsqueda de texto completo necesita el índice de Pagefind, que sale del build. Para tenerla en `dev`:

```bash
bun run build          # genera el sitio y el índice
bun run search:index   # copia el índice a public/pagefind (ignorado por git)
```

Sin ese índice el buscador sigue funcionando con las búsquedas precalculadas.

### **Scripts**

| Script                      | Qué hace                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| `bun run dev`               | Servidor de desarrollo                                                      |
| `bun run build`             | `astro check` + build + índice de Pagefind en `.vercel/output/static`       |
| `bun run check`             | Verificación de tipos (`astro check`)                                       |
| `bun run lint`              | oxlint                                                                      |
| `bun run format`            | oxfmt                                                                       |
| `bun run search:index`      | Índice de Pagefind en `public/pagefind` para `dev`                          |
| `bun run knowledge:prepare` | Reparte en lotes los artículos nuevos o modificados que faltan en el índice |
| `bun run knowledge:merge`   | Une los lotes con `knowledge.json` (simula; `--write` para escribir)        |
| `bun run knowledge:check`   | Valida `knowledge.json` contra el contenido                                 |

`astro preview` no funciona con el adapter de Vercel (ver `docs/pendientes/tecnico.md`).

Un hook de pre-commit (husky + lint-staged) formatea, pasa oxlint y corre `astro check` sobre los archivos modificados.

## 📁 **Estructura**

```
src/
├── components/        # Componentes Astro (y GraphView.svelte)
├── content/           # Colecciones: blog, libros, autores, clases
├── data/              # Índice de conocimiento y su esquema
├── layouts/           # Plantillas de página
├── lib/components/    # Componentes Svelte (menú ⌘K, selector de piel)
├── pages/             # Rutas
├── styles/            # Tokens de tema, estilos globales y de prosa
└── utils/             # Búsqueda, datos del grafo, SEO, filtros de posts…
scripts/knowledge/     # Generación y validación del índice de conocimiento
docs/
├── citas/             # Banco de citas y textos para redes
├── libros/            # Política de contenido de las fichas de libros
└── pendientes/        # Deuda técnica y fe de erratas de contenido
```

## 🚧 **Pendientes**

Lo que falta por hacer está en [`docs/pendientes/`](./docs/pendientes/README.md):

- **Técnico**: deprecaciones de Astro, limitaciones del adapter.
- **Contenido**: notas al pie incompletas en los 3 borradores, autorías y descripciones por revisar, errores de traducción detectados al generar el índice.

## 🌐 **Deploy**

Vercel despliega automáticamente desde `main`, y las demás ramas generan vistas previas.

## 🤝 **Contribuir**

Las contribuciones son bienvenidas: abre un issue con sugerencias de contenido o problemas, o un Pull Request desde una rama propia.

---

**🙏 "Toda escritura es inspirada por Dios y útil para enseñar, para reprender, para corregir y para instruir en la justicia"** - 2 Timoteo 3:16
