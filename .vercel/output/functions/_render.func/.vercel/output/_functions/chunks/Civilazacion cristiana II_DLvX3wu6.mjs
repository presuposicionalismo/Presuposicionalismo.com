import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "Civilizaci\xF3n Cristiana: La \xFAnica civilizaci\xF3n posible, Parte II",
  "description": "Como se explica en la Parte I, las visiones del mundo no cristianas sufren una tensi\xF3n irresoluble entre el racionalismo y el irracionalismo. Esto se expresa a menudo como el problema moderno de la objetividad frente a la subjetividad. La Era de la Fe se considera irremediablemente perdida, y ahora estamos en la Era de la Raz\xF3n. Pero los intentos de justificaciones filos\xF3ficas de la racionalidad secular se han topado con problemas irresolubles. El intento de ser objetivo confiando en la observaci\xF3n pura como fuente de conocimiento se top\xF3 con el problema de que un elemento subjetivo e interpretativo no pod\xEDa ser eliminado. Esto ha provocado un giro hacia la adopci\xF3n de lo subjetivo, pero no como una nueva soluci\xF3n para explicar la racionalidad secular, sino como la resignaci\xF3n de la desesperaci\xF3n de que no hay respuestas a la pregunta fundamental de c\xF3mo conocemos las cosas. En nuestra era postmoderna, el salto reflexivo hacia la defensa de la objetividad es, ir\xF3nicamente, un salto de fe en que debe haber alguna soluci\xF3n al problema de la racionalidad humana, aunque nadie lo haya descubierto todav\xEDa.",
  "author": "Michael Warren",
  "pubDate": "2023-01-01",
  "coverBook": "https://ik.imagekit.io/presuposicionalismo/covers/warren2.webp",
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
const url = "src/content/libros/Civilazacion%20cristiana%20II.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana II.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana II.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
