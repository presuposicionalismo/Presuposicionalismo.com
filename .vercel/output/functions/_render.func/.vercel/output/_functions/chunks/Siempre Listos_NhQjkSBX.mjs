import { a7 as __astro_tag_component__, a8 as Fragment, a1 as createVNode } from './astro_BllRs4tC.mjs';
import { $ as $$Image } from './pages/generic_8JPGN1N8.mjs';

const frontmatter = {
  "title": "Siempre Listos",
  "description": "Este libro es una compilaci\xF3n de varias de las obras publicadas por el Dr. Bahnsen sobre apolog\xE9tica cristiana, incluyendo su programa de estudios de Apolog\xE9tica, art\xEDculos sobre problemas apolog\xE9ticos pr\xE1cticos (como el problema del mal, el problema de los milagros, etc.), y una exposici\xF3n de Hechos 17. Siempre Listos es un libro fenomenal. Un tesoro de apolog\xE9tica b\xEDblica y sana doctrina; una perla de sabidur\xEDa y verdad. Como Bahnsen dijo \xABLa apolog\xE9tica es el talento especial de algunos creyentes, y el pasatiempo interesado de otros; pero es la responsabilidad ordenada por Dios de todos los creyentes\xBB. La apolog\xE9tica no es opcional para los creyentes. Debemos estar \u201Csiempre listos\u201D (1 Pedro 3:15) para dar una defensa de la esperanza que est\xE1 dentro de nosotros. As\xED que, por todos los medios, entr\xE9guese al estudio de la apolog\xE9tica, en el cual este libro ser\xE1 invaluable.",
  "author": "Greg Bahnsen",
  "pubDate": "2023-01-01",
  "coverBook": "https://ik.imagekit.io/presuposicionalismo/covers/Alway-Ready.webp",
  "downloadBook": "https://bit.ly/gbsiempre"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "recomendaciones",
    "text": "Recomendaciones"
  }, {
    "depth": 3,
    "slug": "autor",
    "text": "Autor"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    blockquote: "blockquote",
    h2: "h2",
    h3: "h3",
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "recomendaciones",
      children: "Recomendaciones"
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: ["\xABGreg Bahnsen fue un erudito brillante. Pero esta es una descripci\xF3n inadecuada de lo que ten\xEDa que ofrecer a la iglesia. El valor de su obra no era meramente acad\xE9mico (aunque tambi\xE9n lo era); era intensamente pr\xE1ctico. Su capacidad para analizar la \u201Cl\xF3gica\u201D de la incredulidad y demostrar su necedad, y exponer el Evangelio como la \xFAnica alternativa intelectualmente honesta, era insuperable. Cuando se trataba de apolog\xE9tica, Greg era \xFAnico en su clase\xBB.\n", createVNode("cite", {
          children: "Stephen C. Perks, Director, Fundaci\xF3n de Reconstrucci\xF3n Cristiana."
        })]
      }), "\n"]
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: ["\xABPara aquellos que quieren entender a Van Til, ya sea para estar de acuerdo o en desacuerdo, al menos dos cosas son esenciales y demasiado a menudo descuidadas. La primera es leer a Van Til, la segunda es leer a Greg Bahnsen\xBB.\n", createVNode("cite", {
          children: " Dr. Scott Oliphint, Profesor Adjunto de Apolog\xE9tica, Seminario Teol\xF3gico Westminster, Filadelfia. "
        })]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "autor",
      children: "Autor"
    }), "\n", createVNode(_components.p, {
      children: "Greg L. Bahnsen (MDiv, ThM, Westminster Theological Seminary; PhD, University of Southern California) fue becario residente en el Southern California Center for Christian Studies de Irvine. Distinguido acad\xE9mico, autor y polemista, escribi\xF3 y dio numerosas conferencias sobre apolog\xE9tica y ley b\xEDblica."
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
const url = "src/content/libros/Siempre%20Listos.mdx";
const file = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Siempre Listos.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Siempre Listos.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
