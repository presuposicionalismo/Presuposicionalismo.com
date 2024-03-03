import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "Civilizaci\xF3n Cristiana: La \xFAnica civilizaci\xF3n posible, Parte I",
  "description": "El presente ensayo de Mike Warren afirma la posici\xF3n de Van Til que \xABTodos los argumentos te\xEDstas deben ser realmente tomados en conjunto y reducidos al argumento de la posibilidad de la predicaci\xF3n humana. Dios, como autosuficiente, como Aquel en quien el Uno y el Muchos son igualmente \xFAltimos, [como] Aquel en quien las personas de la Trinidad son indistintamente exhaustivas, es la presuposici\xF3n para el uso inteligente de palabras con respecto a cualquier cosa en el universo, ya sean los \xE1rboles del jard\xEDn o los \xE1ngeles en el cielo.\xBB.",
  "author": "Michael Warren",
  "pubDate": "2023-01-01",
  "coverBook": "https://ik.imagekit.io/presuposicionalismo/covers/warren1.webp",
  "downloadBook": "https://bit.ly/mwonlyciv"
};
function getHeadings() {
  return [];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  return createVNode(Fragment, {});
}
function MDXContent(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent();
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url = "src/content/libros/Civilazacion%20cristiana%20I.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana I.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana I.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
