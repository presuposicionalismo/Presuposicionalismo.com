import { c as createAstro, d as createComponent, r as renderTemplate, e as addAttribute, m as maybeRenderHead, f as renderComponent, s as spreadAttributes, g as renderSlot, h as renderHead } from '../astro_BllRs4tC.mjs';
/* empty css                          */
/* empty css                          */
/* empty css                          */
/* empty css                          */

const $$Astro$e = createAstro("https://presuposicionalismo.com");
const $$BaseHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const { title, description, image = "/Portada.png" } = Astro2.props;
  return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!-- <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> --><link rel="icon" type="image/svg+xml" href="/favicon.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- <ViewTransitions /> --><!-- Font preloads --><!-- <link
  rel="preload"
  href="/fonts/atkinson-regular.woff"
  as="font"
  type="font/woff"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/atkinson-bold.woff"
  as="font"
  type="font/woff"
  crossorigin
/> --><!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.url), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.url), "content")}>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/BaseHead.astro", void 0);

const $$Astro$d = createAstro("https://presuposicionalismo.com");
const $$FormattedDate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$FormattedDate;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<time${addAttribute(date.toISOString(), "datetime")} data-astro-cid-baakmyjh> ${date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/FormattedDate.astro", void 0);

const $$Astro$c = createAstro("https://presuposicionalismo.com");
const $$Separator = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Separator;
  return renderTemplate`${maybeRenderHead()}<hr>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Separator.astro", void 0);

const $$Astro$b = createAstro("https://presuposicionalismo.com");
const $$BlogHero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$BlogHero;
  const { title, description, pubDate, heroImage } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="container" data-astro-cid-ffijqjw4> <article class="card" data-astro-cid-ffijqjw4> <div class="card__image rad-shadow" data-astro-cid-ffijqjw4> <img${addAttribute(heroImage, "src")} alt="Imagen" data-astro-cid-ffijqjw4> </div> <div data-astro-cid-ffijqjw4> <span data-astro-cid-ffijqjw4>${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": pubDate, "data-astro-cid-ffijqjw4": true })}</span> <h1 class="card__title" data-astro-cid-ffijqjw4>${title}</h1> <p class="card__text" data-astro-cid-ffijqjw4>${description}</p> </div> </article>${renderComponent($$result, "Separator", $$Separator, { "data-astro-cid-ffijqjw4": true })} </section> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/BlogHero.astro", void 0);

const $$Astro$a = createAstro("https://presuposicionalismo.com");
const $$HeaderLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, class: className, ...props } = Astro2.props;
  const { pathname } = Astro2.url;
  const isActive = href === pathname || href === pathname.replace(/\/$/, "");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute([className, { active: isActive }], "class:list")}${spreadAttributes(props)} data-astro-cid-eimmu3lg> ${renderSlot($$result, $$slots["default"])} </a> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/HeaderLink.astro", void 0);

const $$Astro$9 = createAstro("https://presuposicionalismo.com");
const $$NavMenu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$NavMenu;
  return renderTemplate`${maybeRenderHead()}<div class="navmenu"> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/" }, { "default": ($$result2) => renderTemplate`Inicio` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog" }, { "default": ($$result2) => renderTemplate`Blog` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/libros" }, { "default": ($$result2) => renderTemplate`Libros` })} </div>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/NavMenu.astro", void 0);

const $$Astro$8 = createAstro("https://presuposicionalismo.com");
const $$Dropdown = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Dropdown;
  return renderTemplate`${maybeRenderHead()}<div class="dropdown" data-astro-cid-pqsyg2qg> <button class="dropbtn" id="dropdown menu" aria-label="Menu Principal" data-astro-cid-pqsyg2qg><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-pqsyg2qg><path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-pqsyg2qg></path><path d="M4 6l16 0" data-astro-cid-pqsyg2qg></path><path d="M4 12l16 0" data-astro-cid-pqsyg2qg></path><path d="M4 18l16 0" data-astro-cid-pqsyg2qg></path></svg> <div class="dropdown-content" data-astro-cid-pqsyg2qg> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/", "data-astro-cid-pqsyg2qg": true }, { "default": ($$result2) => renderTemplate`Inicio` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog", "data-astro-cid-pqsyg2qg": true }, { "default": ($$result2) => renderTemplate`Blog` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/libros", "data-astro-cid-pqsyg2qg": true }, { "default": ($$result2) => renderTemplate`Libros` })} </div> </button> </div> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Dropdown.astro", void 0);

const $$Astro$7 = createAstro("https://presuposicionalismo.com");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Logo;
  return renderTemplate`${maybeRenderHead()}<svg class="logo" viewBox="0 0 628 153" width="150" height="37" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-tvrurpns> <path d="m322 6.7l-6.6 66.6-6.6-66.6c-0.4-3.2 2.3-6.1 6-6.4 3.7-0.3 6.9 2.1 7.2 5.4 0.1 0.3 0.1 0.7 0 1z" data-astro-cid-tvrurpns></path> <path d="m338.4 15.9l-3.8 45.4-3.8-45.4c-0.1-1.9 1.4-3.5 3.5-3.6 2.1-0.2 3.9 1.2 4.1 3.1q0 0.2 0 0.5z" data-astro-cid-tvrurpns></path> <path d="m300 15.9l-3.8 45.4-3.8-45.4c-0.1-1.9 1.4-3.5 3.5-3.6 2.1-0.2 3.9 1.2 4.1 3.1q0 0.2 0 0.5z" data-astro-cid-tvrurpns></path> <path d="m357.6 26.5l-3.8 24.4-3.8-24.4c-0.3-1.8 1.2-3.5 3.3-3.8 2.1-0.3 4 1 4.3 2.9q0 0.5 0 0.9z" data-astro-cid-tvrurpns></path> <path d="m280.8 26.5l-3.8 24.4-3.8-24.4c-0.3-1.8 1.2-3.5 3.3-3.8 2.1-0.3 4 1 4.3 2.9q0.1 0.5 0 0.9z" data-astro-cid-tvrurpns></path> <path d="m376.2 32.2l-3.8 13.5-3.8-13.5c-0.5-1.9 0.8-3.7 2.9-4.2 2.1-0.5 4.2 0.7 4.7 2.5 0.2 0.6 0.2 1.2 0 1.7z" data-astro-cid-tvrurpns></path> <path d="m262.2 32.2l-3.8 13.5-3.8-13.5c-0.5-1.9 0.7-3.7 2.8-4.2 2.1-0.5 4.2 0.7 4.8 2.5 0.1 0.6 0.1 1.2 0 1.7z" data-astro-cid-tvrurpns></path> <path d="m4.1 152h7.2v-26.8h9.1c9.3 0 11.8-2.6 11.8-11.7v-18.3c0-9-2.5-11.7-11.8-11.7h-16.3zm7.2-32.8v-29.7h7.8c5.3 0 5.9 1.7 5.9 6.9v15.9c0 5.2-0.6 6.9-5.9 6.9zm56.9 9.1c0-6.7-1.5-9.8-6.2-11 4.7-1.2 6.2-4.3 6.2-11.1v-11c0-9-2.6-11.7-12-11.7h-16.9v68.5h7.2v-31.8h7.9c5.5 0 6.5 2.3 6.5 7.6v13.6c0 4.3 0 8.4 1 10.6h7.7c-1.1-3.4-1.4-7.6-1.4-12zm-7.3-21.1c0 5.2-0.5 7-5.8 7h-8.6v-24.8h8.6c5.4 0 5.8 1.7 5.8 7zm23.9-17.8h14.8v-6h-22.1v68.5h22.1v-6h-14.8v-27h12.6v-5.8h-12.6zm41.2 50c0 5.3-0.5 7-5.7 7h-2.1c-5.3 0-5.7-1.7-5.7-7v-12.3h-6.9v13.6c0 9 2.6 11.7 11.9 11.7h4c9.3 0 11.7-2.7 11.7-11.7v-7.1c0-8.5-1.7-11.3-11.1-18.9-7.9-6.5-9.2-8.5-9.2-14.9v-4.1c0-5.2 0.4-6.8 5.7-6.8h2.1c5.3 0 5.7 1.6 5.7 6.9v10.4h6.8v-11.7c0-9-2.4-11.6-11.7-11.6h-4c-9.3 0-11.9 2.6-11.9 11.6v5.4c0 8.5 1.8 11.2 11.1 18.9 8 6.5 9.3 8.4 9.3 14.9zm22.8-56.1h-7.2v57.3c0 9 2.4 11.7 11.9 11.7h4.7c9.4 0 11.9-2.7 11.9-11.7v-57.3h-6.9v56.1c0 5.3-0.4 6.9-5.8 6.9h-2.8c-5.3 0-5.8-1.6-5.8-6.9zm30.9 68.5h7.3v-26.8h9c9.3 0 11.9-2.7 11.9-11.8v-18.3c0-9-2.6-11.6-11.9-11.6h-16.3zm7.3-32.8v-29.7h7.8c5.3 0 5.8 1.6 5.8 6.9v15.9c0 5.1-0.5 6.9-5.8 6.9zm27.2 21.6c0 9 2.6 11.7 12 11.7h5.1c9.4 0 12-2.7 12-11.7v-46.2c0-9-2.6-11.6-12-11.6h-5.1c-9.4 0-12 2.6-12 11.6zm21.7-1.2c0 5.3-0.3 6.9-5.7 6.9h-2.9c-5.4 0-5.7-1.6-5.7-6.9v-43.7c0-5.2 0.3-6.9 5.7-6.9h2.9c5.4 0 5.7 1.7 5.7 6.9zm35.5 0c0 5.3-0.4 7-5.7 7h-2.1c-5.3 0-5.7-1.7-5.7-7v-12.3h-6.8v13.6c0 9 2.5 11.7 11.8 11.7h4c9.3 0 11.7-2.7 11.7-11.7v-7.1c0-8.5-1.7-11.3-11.1-18.9-7.9-6.5-9.2-8.5-9.2-14.9v-4.1c0-5.2 0.5-6.8 5.7-6.8h2.1c5.3 0 5.7 1.6 5.7 6.9v10.4h6.8v-11.7c0-9-2.4-11.6-11.7-11.6h-4c-9.3 0-11.8 2.6-11.8 11.6v5.4c0 8.5 1.7 11.2 11.1 18.9 7.9 6.5 9.2 8.4 9.2 14.9zm15.8 12.4h7.3v-68.5h-7.3zm23.9-56.1c0-5.2 0.3-6.9 5.7-6.9h2.8c5.4 0 5.8 1.7 5.8 6.9v12.2h6.9v-13.4c0-9-2.4-11.7-11.9-11.7h-4.7c-9.5 0-12 2.7-12 11.7v46.2c0 9 2.5 11.6 12 11.6h4.7c9.5 0 11.9-2.6 11.9-11.6v-16.4h-6.9v15.1c0 5.3-0.4 6.9-5.8 6.9h-2.8c-5.4 0-5.7-1.6-5.7-6.9zm30.3 56h7.3v-68.4h-7.3zm16.5-11.2c0 9 2.5 11.6 12 11.6h5c9.5 0 12-2.6 12-11.6v-46.2c0-9-2.5-11.6-12-11.6h-5c-9.5 0-12 2.6-12 11.6zm21.6-1.2c0 5.2-0.3 6.9-5.7 6.9h-2.8c-5.4 0-5.7-1.7-5.7-6.9v-43.7c0-5.3 0.3-6.9 5.7-6.9h2.8c5.4 0 5.7 1.6 5.7 6.9zm37.5 12.4h8.2v-68.4h-6.4v42c0 4.3 0.2 8.1 0.3 11.9-0.7-3.8-1.4-7.6-2.5-11.8l-11.1-42.1h-9.4v68.4h6.3v-44.9c0-4.3-0.1-8.1-0.2-11.8 0.6 3.7 1.4 7.5 2.5 11.6zm38.8 0h7.3l-10.7-68.4h-10l-10.8 68.4h6.5l1.8-11h14zm-12.7-31.5c2-12.4 3.2-23.2 3.8-31.1 0.8 7.9 2.1 18.6 4 31.1l2.2 14.5h-12.3zm26.8 31.5h20.4v-6h-13.1v-62.5h-7.3zm26.4 0h7.2v-68.5h-7.2zm36-12.4c0 5.3-0.4 6.9-5.7 6.9h-2.1c-5.3 0-5.7-1.6-5.7-6.9v-12.4h-6.8v13.6c0 9 2.5 11.7 11.9 11.7h3.9c9.4 0 11.8-2.7 11.8-11.7v-7.1c0-8.5-1.8-11.2-11.1-18.9-7.9-6.4-9.3-8.5-9.3-14.9v-4.1c0-5.1 0.5-6.8 5.8-6.8h2.1c5.2 0 5.7 1.7 5.7 6.9v10.4h6.8v-11.6c0-9-2.4-11.7-11.8-11.7h-3.9c-9.4 0-11.9 2.7-11.9 11.7v5.3c0 8.6 1.8 11.2 11.1 18.9 7.9 6.5 9.2 8.4 9.2 14.9zm46.6-33.6c0.6-3 1-7.4 1.6-11-0.1 3.5-0.3 7.9-0.3 11v46h7.2v-68.5h-10.9l-7.8 45.8c-0.4 2.9-0.8 6.3-1 9.6-0.3-3.3-0.6-6.7-1.1-9.6l-7.8-45.8h-10.8v68.5h6.3v-46c0-3.1-0.1-8.2-0.2-12 0.4 3.8 1.1 8.7 1.7 12l8.4 46h6.5zm17.6 34.9c0 9 2.5 11.6 12 11.6h5c9.5 0 12-2.6 12-11.6v-46.2c0-9-2.5-11.7-12-11.7h-5c-9.5 0-12 2.7-12 11.7zm21.6-1.3c0 5.3-0.3 6.9-5.7 6.9h-2.8c-5.4 0-5.8-1.6-5.8-6.9v-43.6c0-5.3 0.4-7 5.8-7h2.8c5.4 0 5.7 1.7 5.7 7z" data-astro-cid-tvrurpns></path> <path d="m3 64.4h225" data-astro-cid-tvrurpns></path> <path d="m625.7 64.4h-219.2" data-astro-cid-tvrurpns></path> </svg> <!-- stroke="currentColor" fill="currentColor" --> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Logo.astro", void 0);

const $$Astro$6 = createAstro("https://presuposicionalismo.com");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <a class="logo" aria-label="logo" href="/" data-astro-cid-3ef6ksr2>${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-3ef6ksr2": true })}</a> <nav data-astro-cid-3ef6ksr2> ${renderComponent($$result, "NavMenu", $$NavMenu, { "data-astro-cid-3ef6ksr2": true })} ${renderComponent($$result, "Dropdown", $$Dropdown, { "data-astro-cid-3ef6ksr2": true })} </nav> </header> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Header.astro", void 0);

const $$Astro$5 = createAstro("https://presuposicionalismo.com");
const $$DarkToogle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$DarkToogle;
  return renderTemplate`${maybeRenderHead()}<button class="theme-toggle" id="theme-toggle" title="Toggles light & dark" aria-label="theme-toggle" aria-live="polite"> <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"> <!-- https://feathericons.com/?query=sun --> <mask id="moon"> <rect x="0" y="0" width="100%" height="100%" fill="white"></rect> <circle cx="40" cy="8" r="11" fill="black"></circle> </mask> <circle id="sun" cx="12" cy="12" r="11" mask="url(#moon)"></circle> <g id="sun-beams"> <line x1="12" y1="1" x2="12" y2="3"></line> <line x1="12" y1="21" x2="12" y2="23"></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line> <line x1="1" y1="12" x2="3" y2="12"></line> <line x1="21" y1="12" x2="23" y2="12"></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line> </g> </svg> </button>  `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/DarkToogle.astro", void 0);

const $$Astro$4 = createAstro("https://presuposicionalismo.com");
const $$SocialFooter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SocialFooter;
  return renderTemplate`${maybeRenderHead()}<div class="social socialicons" data-astro-cid-rbfrkoxy> <!-- X/ Twitter --> <a href="https://twitter.com/Presuposicional/" aria-label="https://twitter.com/Presuposicional/" data-astro-cid-rbfrkoxy><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rbfrkoxy> <path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-rbfrkoxy></path> <path d="M4 4l11.733 16h4.267l-11.733 -16z" data-astro-cid-rbfrkoxy></path> <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" data-astro-cid-rbfrkoxy></path> </svg></a> <!-- Facebook --> <a href="https://www.facebook.com/Presuposicionalismo/" aria-label="https://www.facebook.com/Presuposicionalismo/" data-astro-cid-rbfrkoxy><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-facebook" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rbfrkoxy> <path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-rbfrkoxy></path> <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" data-astro-cid-rbfrkoxy></path> </svg></a> <!-- Instagram --> <a href="https://www.instagram.com/Presuposicionalismo/" aria-label="https://www.instagram.com/Presuposicionalismo/" data-astro-cid-rbfrkoxy> <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-instagram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rbfrkoxy> <path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-rbfrkoxy></path> <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" data-astro-cid-rbfrkoxy></path> <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" data-astro-cid-rbfrkoxy></path> <path d="M16.5 7.5l0 .01" data-astro-cid-rbfrkoxy></path> </svg> </a> <!-- Youtube --> <a href="https://www.youtube.com/channel/UC8SWa--sH2vDuaCxOFFQN6w" aria-label="https://www.youtube.com/channel/UC8SWa--sH2vDuaCxOFFQN6w" data-astro-cid-rbfrkoxy> <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-youtube" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-rbfrkoxy> <path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-rbfrkoxy></path> <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z" data-astro-cid-rbfrkoxy></path> <path d="M10 9l5 3l-5 3z" data-astro-cid-rbfrkoxy></path> </svg> </a> </div> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/SocialFooter.astro", void 0);

const $$Astro$3 = createAstro("https://presuposicionalismo.com");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <a class="logo" aria-label="logo" href="/" data-astro-cid-sz7xmlte>${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-sz7xmlte": true })}</a> <nav data-astro-cid-sz7xmlte> <!-- <NavMenu />--> ${renderComponent($$result, "SocialFooter", $$SocialFooter, { "data-astro-cid-sz7xmlte": true })} ${renderComponent($$result, "DarkToogle", $$DarkToogle, { "data-astro-cid-sz7xmlte": true })} </nav> </footer> `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/components/Footer.astro", void 0);

const $$Astro$2 = createAstro("https://presuposicionalismo.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-speed-insights", "vercel-speed-insights", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} `;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/node_modules/.pnpm/@vercel+speed-insights@1.0.10/node_modules/@vercel/speed-insights/dist/astro/index.astro", void 0);

const $$Astro$1 = createAstro("https://presuposicionalismo.com");
const $$BlogPost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const { title, description, pubDate, heroImage } = Astro2.props;
  return renderTemplate`<html lang="es"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} <main> ${renderComponent($$result, "BlogHero", $$BlogHero, { "title": title, "heroImage": heroImage, "description": description, "pubDate": pubDate })} <article> ${renderSlot($$result, $$slots["default"])} </article> </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "SpeedInsights", $$Index, {})} </body></html>`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/layouts/BlogPost.astro", void 0);

const $$Astro = createAstro("https://presuposicionalismo.com");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogPost, { "title": "About Me", "description": "Lorem ipsum dolor sit amet", "pubDate": /* @__PURE__ */ new Date("August 08 2021"), "heroImage": "/Portada.png" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo
    integer malesuada nunc vel risus commodo viverra. Adipiscing enim eu turpis
    egestas pretium. Euismod elementum nisi quis eleifend quam adipiscing. In
    hac habitasse platea dictumst vestibulum. Sagittis purus sit amet volutpat.
    Netus et malesuada fames ac turpis egestas. Eget magna fermentum iaculis eu
    non diam phasellus vestibulum lorem. Varius sit amet mattis vulputate enim.
    Habitasse platea dictumst quisque sagittis. Integer quis auctor elit sed
    vulputate mi. Dictumst quisque sagittis purus sit amet.
</p> <p>
Morbi tristique senectus et netus. Id semper risus in hendrerit gravida
    rutrum quisque non tellus. Habitasse platea dictumst quisque sagittis purus
    sit amet. Tellus molestie nunc non blandit massa. Cursus vitae congue mauris
    rhoncus. Accumsan tortor posuere ac ut. Fringilla urna porttitor rhoncus
    dolor. Elit ullamcorper dignissim cras tincidunt lobortis. In cursus turpis
    massa tincidunt dui ut ornare lectus. Integer feugiat scelerisque varius
    morbi enim nunc. Bibendum neque egestas congue quisque egestas diam. Cras
    ornare arcu dui vivamus arcu felis bibendum. Dignissim suspendisse in est
    ante in nibh mauris. Sed tempus urna et pharetra pharetra massa massa
    ultricies mi.
</p> <p>
Mollis nunc sed id semper risus in. Convallis a cras semper auctor neque.
    Diam sit amet nisl suscipit. Lacus viverra vitae congue eu consequat ac
    felis donec. Egestas integer eget aliquet nibh praesent tristique magna sit
    amet. Eget magna fermentum iaculis eu non diam. In vitae turpis massa sed
    elementum. Tristique et egestas quis ipsum suspendisse ultrices. Eget lorem
    dolor sed viverra ipsum. Vel turpis nunc eget lorem dolor sed viverra.
    Posuere ac ut consequat semper viverra nam. Laoreet suspendisse interdum
    consectetur libero id faucibus. Diam phasellus vestibulum lorem sed risus
    ultricies tristique. Rhoncus dolor purus non enim praesent elementum
    facilisis. Ultrices tincidunt arcu non sodales neque. Tempus egestas sed sed
    risus pretium quam vulputate. Viverra suspendisse potenti nullam ac tortor
    vitae purus faucibus ornare. Fringilla urna porttitor rhoncus dolor purus
    non. Amet dictum sit amet justo donec enim.
</p> <p>
Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Tortor posuere ac
    ut consequat semper viverra. Tellus mauris a diam maecenas sed enim ut sem
    viverra. Venenatis urna cursus eget nunc scelerisque viverra mauris in. Arcu
    ac tortor dignissim convallis aenean et tortor at. Curabitur gravida arcu ac
    tortor dignissim convallis aenean et tortor. Egestas tellus rutrum tellus
    pellentesque eu. Fusce ut placerat orci nulla pellentesque dignissim enim
    sit amet. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam.
    Id donec ultrices tincidunt arcu. Id cursus metus aliquam eleifend mi.
</p> <p>
Tempus quam pellentesque nec nam aliquam sem. Risus at ultrices mi tempus
    imperdiet. Id porta nibh venenatis cras sed felis eget velit. Ipsum a arcu
    cursus vitae. Facilisis magna etiam tempor orci eu lobortis elementum.
    Tincidunt dui ut ornare lectus sit. Quisque non tellus orci ac. Blandit
    libero volutpat sed cras. Nec tincidunt praesent semper feugiat nibh sed
    pulvinar proin gravida. Egestas integer eget aliquet nibh praesent tristique
    magna.
</p> ` })}`;
}, "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/about.astro", void 0);

const $$file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/about.astro";
const $$url = "/about";

const about = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$BaseHead as $, $$Header as a, $$Footer as b, $$Index as c, $$FormattedDate as d, $$BlogPost as e, about as f };
