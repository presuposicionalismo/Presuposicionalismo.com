import { getCollection } from "astro:content";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3";
import knowledgeJson from "../data/knowledge.json";
import { knowledgeSchema, type KnowledgeEdge } from "../data/knowledge.schema";
import postFilter from "./postFilter";
import { slugifyStr } from "./slugify";

// Datos de /grafo: el índice de conocimiento (src/data/knowledge.json)
// resuelto contra las colecciones, con la disposición ya calculada. La
// simulación corre en el build y es determinista (d3-force no usa azar salvo
// para nodos superpuestos), así que el grafo se sirve como SVG estático y el
// cliente solo agrega zoom e interacción.

export type GraphNodeKind = "articulo" | "concepto" | "autor" | "libro";
export type GraphEdgeType = KnowledgeEdge["type"];

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  description?: string;
  url?: string;
  degree: number;
  r: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

// Distancia de reposo por tipo de relación: los temas agrupan artículos
// alrededor de su concepto; las relaciones entre artículos los acercan.
const LINK_DISTANCE: Record<GraphEdgeType, number> = {
  trata: 70,
  relacionado: 90,
  desarrolla: 80,
  "responde-a": 80,
  critica: 90,
  cita: 110,
};

type SimNode = GraphNode & SimulationNodeDatum;

// Proporción del lienzo (ancho / alto), la del recuadro en escritorio.
const ASPECT = 16 / 9;

export async function getGraphData(): Promise<GraphData> {
  const knowledge = knowledgeSchema.parse(knowledgeJson);
  const [posts, authors, books] = await Promise.all([
    getCollection("blog", postFilter),
    getCollection("autores"),
    getCollection("libros"),
  ]);

  const nodes = new Map<string, Omit<GraphNode, "degree" | "r" | "x" | "y">>();
  for (const post of posts) {
    nodes.set(`blog:${post.id}`, {
      id: `blog:${post.id}`,
      kind: "articulo",
      label: post.data.title,
      description: post.data.seoDescription ?? post.data.description,
      url: `/blog/${slugifyStr(post.data.title)}/`,
    });
  }
  for (const concept of knowledge.concepts) {
    nodes.set(`concepto:${concept.id}`, {
      id: `concepto:${concept.id}`,
      kind: "concepto",
      label: concept.label,
      description: concept.description,
      url: concept.tag ? `/tags/${slugifyStr(concept.tag)}` : undefined,
    });
  }
  for (const author of authors) {
    nodes.set(`autores:${author.id}`, {
      id: `autores:${author.id}`,
      kind: "autor",
      label: author.data.name,
      description: author.data.role,
      url: `/autores/${author.id}/`,
    });
  }
  for (const book of books) {
    nodes.set(`libros:${book.id}`, {
      id: `libros:${book.id}`,
      kind: "libro",
      label: book.data.title,
      description: book.data.seoDescription ?? book.data.description,
      url: `/libros/${book.id}/`,
    });
  }

  // Solo aristas cuyos dos extremos existen (un post en borrador desaparece
  // con sus relaciones) y solo nodos con al menos una arista.
  const edges: GraphEdge[] = knowledge.edges
    .filter((e) => nodes.has(e.source) && nodes.has(e.target))
    .map(({ source, target, type, weight }) => ({ source, target, type, weight }));
  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }

  const radius = (kind: GraphNodeKind, d: number) =>
    kind === "concepto"
      ? 5 + Math.sqrt(d) * 1.6
      : kind === "articulo"
        ? 3.5 + Math.sqrt(d) * 0.6
        : 6;

  const simNodes: SimNode[] = [...nodes.values()]
    .filter((n) => degree.has(n.id))
    .map((n) => {
      const d = degree.get(n.id)!;
      return { ...n, degree: d, r: radius(n.kind, d), x: 0, y: 0 };
    });
  const simLinks: SimulationLinkDatum<SimNode>[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
    type: e.type,
    weight: e.weight,
  }));

  forceSimulation(simNodes)
    .force(
      "link",
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(simLinks)
        .id((n) => n.id)
        .distance((l: any) => LINK_DISTANCE[l.type as GraphEdgeType])
        .strength((l: any) => 0.15 + 0.35 * l.weight),
    )
    .force(
      "charge",
      forceManyBody<SimNode>()
        // Repulsión proporcional al grado: un concepto con una sola
        // conexión no debe salir despedido y agrandar el lienzo.
        .strength((n) => (n.kind === "concepto" ? -60 - 22 * n.degree : -110))
        .distanceMax(600),
    )
    .force(
      "collide",
      forceCollide<SimNode>((n) => n.r + 9),
    )
    // Más atracción vertical que horizontal: el grafo sale apaisado, como
    // el recuadro donde se muestra.
    .force("x", forceX(0).strength(0.012))
    .force("y", forceY(0).strength(0.12))
    .stop()
    .tick(400);

  // Normalizar a un lienzo con origen en 0, un margen para las etiquetas y
  // la proporción del recuadro de /grafo (apaisado), para que el grafo lo
  // llene en vez de quedar como una isla en el centro.
  const pad = 40;
  const xs = simNodes.map((n) => n.x);
  const ys = simNodes.map((n) => n.y);
  let [minX, maxX] = [Math.min(...xs) - pad, Math.max(...xs) + pad];
  let [minY, maxY] = [Math.min(...ys) - pad, Math.max(...ys) + pad];
  const extraX = Math.max(0, (maxY - minY) * ASPECT - (maxX - minX)) / 2;
  const extraY = Math.max(0, (maxX - minX) / ASPECT - (maxY - minY)) / 2;
  [minX, maxX] = [minX - extraX, maxX + extraX];
  [minY, maxY] = [minY - extraY, maxY + extraY];
  const round = (v: number) => Math.round(v * 10) / 10;

  return {
    nodes: simNodes.map(({ id, kind, label, description, url, degree: d, r, x, y }) => ({
      id,
      kind,
      label,
      description,
      url,
      degree: d,
      r: round(r),
      x: round(x - minX),
      y: round(y - minY),
    })),
    edges,
    width: Math.ceil(maxX - minX),
    height: Math.ceil(maxY - minY),
  };
}
