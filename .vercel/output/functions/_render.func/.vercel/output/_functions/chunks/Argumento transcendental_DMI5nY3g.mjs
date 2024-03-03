import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "El Argumento Trascendental para la Existencia de Dios",
  "description": "Argumento Trascendental para la Existencia de Dios",
  "author": "Greg Bahnsen",
  "pubDate": "2023-01-01",
  "coverBook": "https://ik.imagekit.io/presuposicionalismo/covers/tag.webp",
  "downloadBook": "https://bit.ly/ElArgumento"
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "el-argumento-trascendental-para-la-existencia-de-dios",
    "text": "El Argumento Trascendental para la Existencia de Dios"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "el-argumento-trascendental-para-la-existencia-de-dios",
      children: "El Argumento Trascendental para la Existencia de Dios"
    }), "\n", createVNode(_components.p, {
      children: "Si el pensamiento y el razonamiento del cristiano y del no cristiano se gu\xEDan por presuposiciones contrarias, y si esas presuposiciones determinan la concepci\xF3n del conocimiento, la racionalidad y la prueba de cada uno, entonces podr\xEDa parecer que razonar con los no creyentes es una empresa in\xFAtil. Algunos cr\xEDticos de Van Til han intentado err\xF3neamente sacar esa conclusi\xF3n para su sistema de apolog\xE9tica. Pero \xE9l nunca mir\xF3 a la defensa de la fe de esa manera en absoluto. No nos quedamos en un irresoluble empate presuposicional. Como d\u0133o Van Til: \xABA todo esto debemos responder humildemente pero con confianza diciendo que tenemos la mejor justificaci\xF3n filos\xF3fica para nuestra posici\xF3n. No es que estemos en un mal camino y que debemos buscar alg\xFAn consuelo en otros que tambi\xE9n est\xE1n en un mal camino.\xBB"
    })]
  });
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
  }) : _createMdxContent(props);
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url = "src/content/libros/Argumento%20transcendental.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Argumento transcendental.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Argumento transcendental.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
