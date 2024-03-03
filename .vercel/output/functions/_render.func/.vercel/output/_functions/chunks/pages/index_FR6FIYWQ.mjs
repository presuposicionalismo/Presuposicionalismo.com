import { c as createAstro, d as createComponent, r as renderTemplate, f as renderComponent, h as renderHead, g as renderSlot, A as AstroError, n as UnknownContentCollectionError, o as renderUniqueStylesheet, p as renderScriptElement, q as createHeadAndContent, u as unescapeHTML, m as maybeRenderHead, e as addAttribute } from '../astro_BllRs4tC.mjs';
import { $ as $$BaseHead, a as $$Header, b as $$Footer, c as $$Index$3, d as $$FormattedDate } from './about_CdFYmUrt.mjs';
/* empty css                          */
/* empty css                          */
/* empty css                          */
import { p as prependForwardSlash } from '../astro/assets-service_CKQhpl_x.mjs';
/* empty css                          */

const $$Astro$5 = createAstro("https://presuposicionalismo.com");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="es"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "SpeedInsights", $$Index$3, {})} </body></html>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/layouts/BaseLayout.astro", void 0);

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1)
      continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
const cacheEntriesByCollection = /* @__PURE__ */ new Map();
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return;
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign({"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": "https://presuposicionalismo.com", "ASSETS_PREFIX": undefined}, {})?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = [...cacheEntriesByCollection.get(collection)];
    } else {
      entries = await Promise.all(
        lazyImports.map(async (lazyImport) => {
          const entry = await lazyImport();
          return type === "content" ? {
            id: entry.id,
            slug: entry.slug,
            body: entry.body,
            collection: entry.collection,
            data: entry.data,
            async render() {
              return render({
                collection: entry.collection,
                id: entry.id,
                renderEntryImport: await getRenderEntryImport(collection, entry.slug)
              });
            }
          } : {
            id: entry.id,
            collection: entry.collection,
            data: entry.data
          };
        })
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries;
    }
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function")
    throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object")
    throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function")
      throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object")
      throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/El Problema Del Mal.md": () => import('../El Problema Del Mal_BspL9wa3.mjs'),"/src/content/blog/La incoherencia de los LGBT - parte 2.md": () => import('../La incoherencia de los LGBT - parte 2_BbRNKA66.mjs'),"/src/content/blog/La incoherencia de los LGBT.md": () => import('../La incoherencia de los LGBT_DkHAvzvM.mjs'),"/src/content/blog/lógica.md": () => import('../lógica_CZz9k4vR.mjs'),"/src/content/blog/¿30.000 denominaciones protestantes.md": () => import('../¿30.000 denominaciones protestantes_BVx2yMeK.mjs'),"/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md": () => import('../¿Van Til dijo que los incrédulos no saben nada_DOnFg41_.mjs'),"/src/content/libros/Apologetica Reformada.mdx": () => import('../Apologetica Reformada_B3ay83Xt.mjs'),"/src/content/libros/Argumento transcendental.mdx": () => import('../Argumento transcendental_DUo-lMHz.mjs'),"/src/content/libros/Civilazacion cristiana I.mdx": () => import('../Civilazacion cristiana I_BC1GETkY.mjs'),"/src/content/libros/Civilazacion cristiana II.mdx": () => import('../Civilazacion cristiana II_Cz8CyBbv.mjs'),"/src/content/libros/La apologetica de Justino.mdx": () => import('../La apologetica de Justino_CMz5rH8P.mjs'),"/src/content/libros/Siempre Listos.mdx": () => import('../Siempre Listos_YrPDGymH.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"blog":{"type":"content","entries":{"el-problema-del-mal":"/src/content/blog/El Problema Del Mal.md","la-incoherencia-de-los-lgbt---parte-2":"/src/content/blog/La incoherencia de los LGBT - parte 2.md","la-incoherencia-de-los-lgbt":"/src/content/blog/La incoherencia de los LGBT.md","lógica":"/src/content/blog/lógica.md","30000-denominaciones-protestantes":"/src/content/blog/¿30.000 denominaciones protestantes.md","van-til-dijo-que-los-incrédulos-no-saben-nada":"/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md"}},"libros":{"type":"content","entries":{"apologetica-reformada":"/src/content/libros/Apologetica Reformada.mdx","argumento-transcendental":"/src/content/libros/Argumento transcendental.mdx","civilazacion-cristiana-i":"/src/content/libros/Civilazacion cristiana I.mdx","civilazacion-cristiana-ii":"/src/content/libros/Civilazacion cristiana II.mdx","la-apologetica-de-justino":"/src/content/libros/La apologetica de Justino.mdx","siempre-listos":"/src/content/libros/Siempre Listos.mdx"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/El Problema Del Mal.md": () => import('../El Problema Del Mal_Bo6CIr3o.mjs'),"/src/content/blog/La incoherencia de los LGBT - parte 2.md": () => import('../La incoherencia de los LGBT - parte 2_BBI4JK_i.mjs'),"/src/content/blog/La incoherencia de los LGBT.md": () => import('../La incoherencia de los LGBT_CHtyDjAv.mjs'),"/src/content/blog/lógica.md": () => import('../lógica_Bg_8o9ag.mjs'),"/src/content/blog/¿30.000 denominaciones protestantes.md": () => import('../¿30.000 denominaciones protestantes_Bs51jUED.mjs'),"/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md": () => import('../¿Van Til dijo que los incrédulos no saben nada_4VurbZle.mjs'),"/src/content/libros/Apologetica Reformada.mdx": () => import('../Apologetica Reformada_BqixytPC.mjs'),"/src/content/libros/Argumento transcendental.mdx": () => import('../Argumento transcendental_BzWDFIlJ.mjs'),"/src/content/libros/Civilazacion cristiana I.mdx": () => import('../Civilazacion cristiana I_DlIYR6NS.mjs'),"/src/content/libros/Civilazacion cristiana II.mdx": () => import('../Civilazacion cristiana II_CpprHnH_.mjs'),"/src/content/libros/La apologetica de Justino.mdx": () => import('../La apologetica de Justino_DAl6mLyj.mjs'),"/src/content/libros/Siempre Listos.mdx": () => import('../Siempre Listos_ax1mMOjq.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const $$Astro$4 = createAstro("https://presuposicionalismo.com");
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index$2;
  const posts = (await getCollection("blog")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
  );
  return renderTemplate`${renderComponent($$result, "MainLayout", $$BaseLayout, { "title": "Blog", "description": "Lorem ipsum dolor sit amet", "pubDate": /* @__PURE__ */ new Date("August 08 2021"), "heroImage": "/blog-placeholder-about.jpg", "data-astro-cid-5tznm7mj": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-5tznm7mj> <section data-astro-cid-5tznm7mj> <h1 class="warp" data-astro-cid-5tznm7mj>Blog</h1> <article data-astro-cid-5tznm7mj> ${posts.map((post) => renderTemplate`<div class="warp" data-astro-cid-5tznm7mj> <div class="card" data-astro-cid-5tznm7mj> <div class="card__image container" data-astro-cid-5tznm7mj> <img${addAttribute(post.data.heroImage, "src")} alt="Imagen" data-astro-cid-5tznm7mj> </div> <div data-astro-cid-5tznm7mj> ${renderComponent($$result2, "FormattedDate", $$FormattedDate, { "date": post.data.pubDate, "data-astro-cid-5tznm7mj": true })} <h2 class="title" data-astro-cid-5tznm7mj> <a class="token funtion"${addAttribute(`/blog/${post.slug}/`, "href")} data-astro-cid-5tznm7mj> ${post.data.title} </a> </h2> <p class="description" data-astro-cid-5tznm7mj> ${post.data.description} <button data-astro-cid-5tznm7mj> <a class="token string"${addAttribute(`/blog/${post.slug}/`, "href")} data-astro-cid-5tznm7mj>
Leer mas
</a> </button> </p> </div> </div> </div>`)} </article> </section> </main> ` })} `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/blog/index.astro", void 0);

const $$file$2 = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/blog/index.astro";
const $$url$2 = "/blog";

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("https://presuposicionalismo.com");
const $$GridBook = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$GridBook;
  return renderTemplate`${maybeRenderHead()}<div class="grid" data-astro-cid-q3bjbg2w> ${renderSlot($$result, $$slots["default"])} </div> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/GridBook.astro", void 0);

const $$Astro$2 = createAstro("https://presuposicionalismo.com");
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index$1;
  const books = (await getCollection("libros")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
  );
  return renderTemplate`${renderComponent($$result, "MainLayout", $$BaseLayout, { "title": "Libros", "description": "Lorem ipsum dolor sit amet", "pubDate": /* @__PURE__ */ new Date("August 08 2021"), "heroImage": "/blog-placeholder-about.jpg", "data-astro-cid-pki3utf7": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-pki3utf7> <section data-astro-cid-pki3utf7> <h1 class="warp" data-astro-cid-pki3utf7>Libros</h1> </section> <section data-astro-cid-pki3utf7> ${renderComponent($$result2, "Grid", $$GridBook, { "data-astro-cid-pki3utf7": true }, { "default": ($$result3) => renderTemplate`${books.map((book) => renderTemplate`<article class="card" data-astro-cid-pki3utf7> <img${addAttribute(book.data.coverBook, "src")}${addAttribute(book.data.title, "alt")} data-astro-cid-pki3utf7> <div class="content" data-astro-cid-pki3utf7> <a${addAttribute(`/libros/${book.slug}/`, "href")} data-astro-cid-pki3utf7> <h2 data-astro-cid-pki3utf7>${book.data.title}</h2> </a> </div> </article>`)}` })} </section> </main> ` })} `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/libros/index.astro", void 0);

const $$file$1 = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/libros/index.astro";
const $$url$1 = "/libros";

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const SITE_TITLE = "Presuposicionalismo.com";
const SITE_DESCRIPTION = "derribando argumentos y toda altivez que se levanta contra el conocimiento de Dios, y llevando cautivo todo pensamiento a la obediencia a Cristo";

const $$Astro$1 = createAstro("https://presuposicionalismo.com");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead()}<section class="container my" data-astro-cid-bbe6dxrz> <h1 data-astro-cid-bbe6dxrz>
¿Estás preparado para algo intelectualmente estimulante y conmovedor para el
    alma?
</h1> <p data-astro-cid-bbe6dxrz>
Este sitio está dedicado a promover literatura que suscribe una filosofía
    distintivamente cristiana y principalmente a la metodología apologética del
    “padre del presuposicionalismo”, el fallecido (1987) Dr. Cornelius Van Til,
    y sus estudiantes, el fallecido (1995) Dr. Greg L. Bahnsen, y el Dr. John M.
    Frame. Otros “vantilianos” de interés incluyen pero no se limitan a: James
    Anderson, William Edgar, Scott Oliphint, James White, y Richard Pratt. De
    cualquier manera, ¡que Dios lo bendiga ricamente a través de este pequeño
    sitio que existe para promover la gloria de Dios solamente!
</p> </section> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Hero.astro", void 0);

const $$Astro = createAstro("https://presuposicionalismo.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="es"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, { "title": SITE_TITLE })} <main class=""> ${renderComponent($$result, "Hero", $$Hero, {})} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/index.astro", void 0);

const $$file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/index.astro";
const $$url = "";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { SITE_TITLE as S, SITE_DESCRIPTION as a, index$1 as b, index as c, getCollection as g, index$2 as i };
