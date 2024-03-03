import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "La apologetica de Justino",
  "description": "Este libro es una compilaci\xF3n de varias de las obras publicadas por el Dr. Bahnsen sobre apolog\xE9tica cristiana, incluyendo su programa de estudios de Apolog\xE9tica, art\xEDculos sobre problemas apolog\xE9ticos pr\xE1cticos (como el problema del mal, el problema de los milagros, etc.), y una exposici\xF3n de Hechos 17.",
  "author": "K. Oliphint & Edgar William",
  "pubDate": "2023-01-01",
  "coverBook": "https://ik.imagekit.io/presuposicionalismo/covers/justino.webp",
  "downloadBook": "https://bit.ly/owjustyn"
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
const url = "src/content/libros/La%20apologetica%20de%20Justino.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/La apologetica de Justino.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/La apologetica de Justino.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
