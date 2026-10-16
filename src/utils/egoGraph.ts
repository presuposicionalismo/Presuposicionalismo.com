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

// Minigrafo de un artículo: él al centro con sus conceptos, los artículos
// con los que se relaciona y los autores o libros que cita. Se calcula en
// el build y se sirve como SVG estático.

export type EgoKind = "actual" | "concepto" | "articulo" | "autor" | "libro";

export interface EgoNode {
  id: string;
  kind: EgoKind;
  label: string;
  url?: string;
  r: number;
  x: number;
  y: number;
}

export interface EgoGraph {
  nodes: EgoNode[];
  edges: { source: string; target: string; type: KnowledgeEdge["type"] }[];
  width: number;
  height: number;
}

// Cuántos vecinos de cada tipo; los de mayor peso primero.
const LIMITS = { concepto: 6, articulo: 4, autor: 3 } as const;
const ARTICLE_EDGES = new Set<KnowledgeEdge["type"]>([
  "relacionado",
  "desarrolla",
  "responde-a",
  "critica",
]);

const SIZE = 200;
const PAD = 16;
const RADIUS: Record<EgoKind, number> = { actual: 7, concepto: 5, articulo: 4, autor: 4, libro: 4 };

type SimNode = EgoNode & SimulationNodeDatum;

export async function getEgoGraph(postId: string): Promise<EgoGraph | null> {
  const knowledge = knowledgeSchema.parse(knowledgeJson);
  const centerId = `blog:${postId}`;

  const [posts, authors, books] = await Promise.all([
    getCollection("blog", postFilter),
    getCollection("autores"),
    getCollection("libros"),
  ]);
  const info = new Map<string, Pick<EgoNode, "kind" | "label" | "url">>();
  for (const p of posts) {
    info.set(`blog:${p.id}`, {
      kind: p.id === postId ? "actual" : "articulo",
      label: p.data.title,
      url: `/blog/${slugifyStr(p.data.title)}/`,
    });
  }
  for (const c of knowledge.concepts) {
    info.set(`concepto:${c.id}`, { kind: "concepto", label: c.label, url: `/conceptos/${c.id}` });
  }
  for (const a of authors) {
    info.set(`autores:${a.id}`, { kind: "autor", label: a.data.name, url: `/autores/${a.id}/` });
  }
  for (const b of books) {
    info.set(`libros:${b.id}`, { kind: "libro", label: b.data.title, url: `/libros/${b.id}/` });
  }
  if (!info.has(centerId)) return null;

  const picked = new Map<string, { type: KnowledgeEdge["type"]; weight: number; out: boolean }>();
  for (const e of knowledge.edges) {
    const out = e.source === centerId;
    if (!out && e.target !== centerId) continue;
    const other = out ? e.target : e.source;
    const kind = info.get(other)?.kind;
    if (!kind) continue;
    // Solo las relaciones que tienen sentido desde un artículo.
    const ok =
      (kind === "concepto" && e.type === "trata") ||
      (kind === "articulo" && ARTICLE_EDGES.has(e.type)) ||
      ((kind === "autor" || kind === "libro") && e.type === "cita");
    if (!ok) continue;
    const prev = picked.get(other);
    if (!prev || e.weight > prev.weight) picked.set(other, { type: e.type, weight: e.weight, out });
  }

  const take = (kinds: EgoKind[], limit: number) =>
    [...picked.entries()]
      .filter(([id]) => kinds.includes(info.get(id)!.kind))
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, limit);
  const chosen = [
    ...take(["concepto"], LIMITS.concepto),
    ...take(["articulo"], LIMITS.articulo),
    ...take(["autor", "libro"], LIMITS.autor),
  ];
  if (chosen.length < 2) return null;

  // Posición inicial determinista: cada tipo en su sector del círculo.
  const sectors: Record<EgoKind, number> = {
    actual: 0,
    concepto: 0,
    articulo: 2.2,
    autor: 4.2,
    libro: 4.2,
  };
  const counters: Partial<Record<EgoKind, number>> = {};
  const simNodes: SimNode[] = [
    { id: centerId, ...info.get(centerId)!, r: RADIUS.actual, x: 0, y: 0, fx: 0, fy: 0 },
    ...chosen.map(([id]) => {
      const n = info.get(id)!;
      const i = (counters[n.kind] = (counters[n.kind] ?? -1) + 1);
      const angle = sectors[n.kind] + i * 0.7;
      return { id, ...n, r: RADIUS[n.kind], x: Math.cos(angle) * 60, y: Math.sin(angle) * 60 };
    }),
  ];
  const links: SimulationLinkDatum<SimNode>[] = chosen.map(([id, e]) => ({
    source: e.out ? centerId : id,
    target: e.out ? id : centerId,
  }));

  forceSimulation(simNodes)
    .force(
      "link",
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(links)
        .id((n) => n.id)
        .distance(55)
        .strength(0.6),
    )
    .force("charge", forceManyBody().strength(-90))
    .force(
      "collide",
      forceCollide<SimNode>((n) => n.r + 6),
    )
    .force("x", forceX(0).strength(0.04))
    .force("y", forceY(0).strength(0.04))
    .stop()
    .tick(300);

  // Ajustar al lienzo manteniendo la proporción; el artículo queda donde
  // lo dejó la simulación (cerca del centro).
  const xs = simNodes.map((n) => n.x!);
  const ys = simNodes.map((n) => n.y!);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const scale = Math.min(
    (SIZE - 2 * PAD) / Math.max(maxX - minX, 1),
    (SIZE - 2 * PAD) / Math.max(maxY - minY, 1),
  );
  const round = (v: number) => Math.round(v * 10) / 10;
  const offX = (SIZE - (maxX - minX) * scale) / 2;
  const offY = (SIZE - (maxY - minY) * scale) / 2;

  return {
    nodes: simNodes.map((n) => ({
      id: n.id,
      kind: n.kind,
      label: n.label,
      url: n.id === centerId ? undefined : n.url,
      r: n.r,
      x: round((n.x! - minX) * scale + offX),
      y: round((n.y! - minY) * scale + offY),
    })),
    edges: chosen.map(([id, e]) => ({
      source: e.out ? centerId : id,
      target: e.out ? id : centerId,
      type: e.type,
    })),
    width: SIZE,
    height: SIZE,
  };
}
