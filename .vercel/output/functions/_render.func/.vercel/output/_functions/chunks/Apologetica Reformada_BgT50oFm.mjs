import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "Apolog\xE9tica Reformada",
  "description": "Este documento recopila traducciones de rese\xF1as de libros y art\xEDculos escritos por el Dr. James Anderson. En primer lugar, se incluyen sus rese\xF1as del libro \xABReforming Apologetics\xBB del Dr. J.V. Fesko. Luego, se presentan dos art\xEDculos adicionales del Dr. Anderson que est\xE1n estrechamente relacionados con el tema principal.",
  "author": "Dr. James N. Anderson",
  "pubDate": "2024-03-03",
  "coverBook": "/coverbook/rtfesko.webp",
  "downloadBook": "https://bit.ly/rtfesko"
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "retrospectiva-t\xF3picos-principales-emergentes",
    "text": "Retrospectiva: T\xF3picos principales emergentes"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    em: "em",
    h1: "h1",
    p: "p",
    strong: "strong",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "retrospectiva-t\xF3picos-principales-emergentes",
      children: "Retrospectiva: T\xF3picos principales emergentes"
    }), "\n", createVNode(_components.p, {
      children: "Si tienes poco tiempo -\xBFy acaso no es as\xED para todos?- puedes hacerte una idea general leyendo la \xABIntroducci\xF3n\xBB, el cap\xEDtulo 1 y el cap\xEDtulo 8. Si te interesan especialmente las cr\xEDticas del Dr. Fesko al \xE9nfasis vantiliano en la \xABvisi\xF3n del mundo\xBB y la defensa de Van Til de la argumentaci\xF3n trascendental, junto con mis respuestas a esas cr\xEDticas, lee el cap\xEDtulo 5 y el cap\xEDtulo 6."
    }), "\n", createVNode(_components.p, {
      children: ["Mi valoraci\xF3n general del libro puede resumirse como sigue: Creo que el Dr. Fesko hace un gran trabajo defendiendo el uso de la revelaci\xF3n natural -\xABel libro de la naturaleza\xBB- en la apolog\xE9tica y mostrando c\xF3mo la corriente principal de la tradici\xF3n reformada ha afirmado con coherencia y entusiasmo dicho uso - aunque con importantes salvedades relacionadas con los efectos no\xE9ticos del pecado y el necesario papel interpretativo de la revelaci\xF3n especial. Sin embargo, los principales defectos del libro son su repetida interpretaci\xF3n y caracterizaci\xF3n err\xF3neas de la postura de Van Til -y de la de otros presuposicionalistas, como John Frame y Scott Oliphint y su incapacidad para establecer su tesis de que las opiniones de Van Til est\xE1n significativamente en desacuerdo con las opiniones de Calvino o con la teolog\xEDa reformada confesional. De hecho, dado lo que el Dr. Fesko afirma en el cap\xEDtulo 8 sobre una \xABepistemolog\xEDa del pacto\xBB, y su acuerdo con Calvino ", createVNode(_components.em, {
        children: ["- ", createVNode(_components.strong, {
          children: "\xA1y Van Til!"
        }), " -"]
      }), " sobre la necesidad de leer \xABel libro de la naturaleza\xBB a trav\xE9s de los \xABlentes correctivos de la Escritura\xBB, creo que deber\xEDa dudar m\xE1s en alinearse con el enfoque tomista \xABcl\xE1sico\xBB de la teolog\xEDa natural y simpatizar m\xE1s con los esfuerzos de Van Til por \xABreformar la apolog\xE9tica\xBB aline\xE1ndola m\xE1s con una epistemolog\xEDa y doctrina de la revelaci\xF3n coherentemente reformadas."]
    }), "\n", createVNode(_components.p, {
      children: "En cualquier caso, es bueno que los hermanos reformados sigan manteniendo estas conversaciones. Estemos agradecidos por las importantes \xE1reas en com\xFAn que afirmamos, mientras buscamos una mejor comprensi\xF3n mutua y -por la gracia de Dios- una mayor convergencia con el tiempo."
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
const url = "src/content/libros/Apologetica%20Reformada.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Apologetica Reformada.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Apologetica Reformada.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
