<script lang="ts">
  import { onMount } from "svelte";
  import { select, zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3";
  import { normalize } from "@utils/search";
  import type { GraphData, GraphEdge, GraphEdgeType, GraphNode, GraphNodeKind } from "@utils/graphData";

  interface Props {
    data: GraphData;
  }

  let { data }: Props = $props();

  // --- Filtros por grupo de relación
  type EdgeGroup = "temas" | "articulos" | "citas";
  const GROUP_OF: Record<GraphEdgeType, EdgeGroup> = {
    trata: "temas",
    relacionado: "articulos",
    desarrolla: "articulos",
    "responde-a": "articulos",
    critica: "articulos",
    cita: "citas",
  };
  const GROUPS: { id: EdgeGroup; label: string }[] = [
    { id: "temas", label: "Temas" },
    { id: "articulos", label: "Entre artículos" },
    { id: "citas", label: "Autores y libros" },
  ];
  let enabled = $state<Record<EdgeGroup, boolean>>({ temas: true, articulos: true, citas: true });

  const KIND_LABEL: Record<GraphNodeKind, string> = {
    articulo: "Artículo",
    concepto: "Concepto",
    autor: "Autor",
    libro: "Libro",
  };
  const ACTION_LABEL: Record<GraphNodeKind, string> = {
    articulo: "Leer el artículo",
    concepto: "Ver la etiqueta",
    autor: "Ver el autor",
    libro: "Ver el libro",
  };

  // Cómo se nombra cada relación desde el nodo seleccionado.
  const OUTGOING: Record<GraphEdgeType, string> = {
    trata: "Temas",
    desarrolla: "Desarrolla",
    "responde-a": "Responde a",
    critica: "Critica a",
    cita: "Cita a",
    relacionado: "Relacionados",
  };
  const INCOMING: Record<GraphEdgeType, string> = {
    trata: "Artículos sobre este tema",
    desarrolla: "Lo desarrollan",
    "responde-a": "Le responden",
    critica: "Lo critican",
    cita: "Lo citan",
    relacionado: "Relacionados",
  };

  // Ancho del panel lateral (md:w-80 + margen), para centrar a su izquierda.
  const PANEL_WIDTH = 344;

  const LEGEND: GraphNodeKind[] = ["concepto", "articulo", "autor", "libro"];

  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const edgeKey = (e: GraphEdge) => `${e.source}|${e.target}|${e.type}`;

  // --- Estado de interacción
  let selectedId = $state<string | null>(null);
  let hoveredId = $state<string | null>(null);
  let query = $state("");
  let transform = $state<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });

  let svgEl = $state<SVGSVGElement | null>(null);
  let graphEl = $state<HTMLDivElement | null>(null);
  let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null = null;
  let reduceMotion = false;

  let visibleEdges = $derived(data.edges.filter((e) => enabled[GROUP_OF[e.type]]));
  // Los artículos siempre se ven; conceptos, autores y libros solo si les
  // queda alguna relación visible.
  let visibleNodes = $derived.by(() => {
    const touched = new Set(visibleEdges.flatMap((e) => [e.source, e.target]));
    return data.nodes.filter((n) => n.kind === "articulo" || touched.has(n.id));
  });

  let focusId = $derived(hoveredId ?? selectedId);
  let neighbors = $derived.by(() => {
    if (!focusId) return null;
    const set = new Set([focusId]);
    for (const e of visibleEdges) {
      if (e.source === focusId) set.add(e.target);
      if (e.target === focusId) set.add(e.source);
    }
    return set;
  });

  let selected = $derived(selectedId ? byId.get(selectedId) : undefined);

  // Conexiones del seleccionado, agrupadas por relación (todas, no solo las
  // visibles: el panel es la vista completa del nodo).
  let connections = $derived.by(() => {
    if (!selectedId) return [];
    const groups = new Map<string, { node: GraphNode; weight: number }[]>();
    const add = (label: string, id: string, weight: number) => {
      const node = byId.get(id);
      if (!node) return;
      const list = groups.get(label) ?? [];
      if (!list.some((c) => c.node.id === id)) list.push({ node, weight });
      groups.set(label, list);
    };
    for (const e of data.edges) {
      if (e.source === selectedId) add(OUTGOING[e.type], e.target, e.weight);
      else if (e.target === selectedId) add(INCOMING[e.type], e.source, e.weight);
    }
    return [...groups.entries()].map(([label, items]) => ({
      label,
      items: items.sort((a, b) => b.weight - a.weight),
    }));
  });

  let matches = $derived.by(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return data.nodes
      .filter((n) => normalize(n.label).includes(q))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 6);
  });

  // Las etiquetas se dibujan a tamaño de pantalla constante (12 px): se
  // compensa el zoom y la escala del SVG en pantalla, que en un móvil
  // vertical reduce mucho el lienzo apaisado.
  let screenScale = $state(1);
  let labelSize = $derived(12 / (transform.k * screenScale));
  const MAX_LABEL = 48;
  const labelText = (n: GraphNode) =>
    n.label.length > MAX_LABEL ? `${n.label.slice(0, MAX_LABEL - 2)}…` : n.label;

  // Candidatas a etiqueta según el zoom; con un nodo enfocado, sus vecinos.
  function wantsLabel(n: GraphNode): boolean {
    if (neighbors) return neighbors.has(n.id);
    if (n.kind === "concepto") return n.degree >= 6 || transform.k > 1.4;
    if (n.kind === "autor" || n.kind === "libro") return transform.k > 1.4;
    return transform.k > 2.4;
  }

  // Colocación voraz: primero el foco y los nodos de más grado; se omite
  // toda etiqueta que se superponga con una ya colocada. El ancho se estima
  // por número de caracteres (~0.6 em cada uno) más un margen.
  let labeled = $derived.by(() => {
    const size = labelSize;
    const placed: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const out = new Set<string>();
    const candidates = visibleNodes
      .filter(wantsLabel)
      .sort((a, b) => Number(b.id === focusId) - Number(a.id === focusId) || b.degree - a.degree);
    for (const n of candidates) {
      const w = labelText(n).length * size * 0.6 + size;
      const box = { x1: n.x - w / 2, x2: n.x + w / 2, y1: n.y - n.r - 6 - size, y2: n.y - n.r };
      const clash = placed.some((p) => box.x1 < p.x2 && box.x2 > p.x1 && box.y1 < p.y2 && box.y2 > p.y1);
      if (clash && n.id !== focusId) continue;
      placed.push(box);
      out.add(n.id);
    }
    return out;
  });

  function nodeOpacity(n: GraphNode): number {
    return neighbors && !neighbors.has(n.id) ? 0.12 : 1;
  }

  function edgeState(e: GraphEdge): "focus" | "dim" | "idle" {
    if (!focusId) return "idle";
    return e.source === focusId || e.target === focusId ? "focus" : "dim";
  }

  // --- Zoom
  function applyTransform(t: ZoomTransform, animate = true) {
    if (!svgEl || !zoomBehavior) return;
    const s = select(svgEl);
    if (animate && !reduceMotion) s.transition().duration(450).call(zoomBehavior.transform, t);
    else s.call(zoomBehavior.transform, t);
  }

  function zoomBy(factor: number) {
    if (!svgEl || !zoomBehavior) return;
    select(svgEl).transition().duration(reduceMotion ? 0 : 250).call(zoomBehavior.scaleBy, factor);
  }

  function resetView() {
    applyTransform(zoomIdentity);
  }

  // Centra el nodo en la parte del recuadro que no tapa el panel: a la
  // izquierda del panel lateral (md+) o por encima de la hoja inferior.
  function centerOn(node: GraphNode) {
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const k = Math.max(transform.k, wide ? 1.8 : 1.8 / screenScale / 1.6);
    const screen = svgEl.createSVGPoint();
    screen.x = rect.left + (wide ? (rect.width - PANEL_WIDTH) / 2 : rect.width / 2);
    screen.y = rect.top + (wide ? rect.height / 2 : rect.height * 0.25);
    const target = screen.matrixTransform(svgEl.getScreenCTM()!.inverse());
    applyTransform(zoomIdentity.translate(target.x - node.x * k, target.y - node.y * k).scale(k));
  }

  function selectNode(id: string | null, { center = true } = {}) {
    selectedId = id;
    hoveredId = null;
    const node = id ? byId.get(id) : undefined;
    if (node && center) centerOn(node);
    // Enlace compartible a la selección.
    const url = new URL(window.location.href);
    url.hash = id ? `n=${encodeURIComponent(id)}` : "";
    history.replaceState(null, "", url);
  }

  function pickMatch(node: GraphNode) {
    query = "";
    selectNode(node.id);
    graphEl?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }

  onMount(() => {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!svgEl) return;
    zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 6])
      .clickDistance(4)
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        transform = { x, y, k };
      });
    select(svgEl).call(zoomBehavior).on("dblclick.zoom", null);

    // Escala del viewBox en pantalla (preserveAspectRatio "meet").
    const measure = () => {
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      screenScale = Math.min(rect.width / data.width, rect.height / data.height) || 1;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svgEl);

    const fromHash = decodeURIComponent(window.location.hash.replace(/^#n=/, ""));
    if (byId.has(fromHash)) selectNode(fromHash);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedId) selectNode(null, { center: false });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
    };
  });

  const conceptIndex = data.nodes
    .filter((n) => n.kind === "concepto")
    .sort((a, b) => b.degree - a.degree || a.label.localeCompare(b.label, "es"));
</script>

{#snippet kindDot(kind: GraphNodeKind)}
  <span
    class="inline-block size-2.5 shrink-0 {kind === 'concepto'
      ? 'rounded-full bg-accent'
      : kind === 'articulo'
        ? 'rounded-full bg-muted'
        : kind === 'autor'
          ? 'rounded-full border-2 border-accent'
          : 'rotate-45 border-2 border-foreground/70'}"
    aria-hidden="true"
  ></span>
{/snippet}

<div class="flex flex-col gap-4">
  <!-- Controles -->
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div class="relative w-full md:max-w-xs">
      <input
        type="text"
        role="searchbox"
        bind:value={query}
        placeholder="Buscar un concepto, artículo o autor…"
        aria-label="Buscar en el grafo"
        onkeydown={(event) => {
          if (event.key === "Enter" && matches[0]) pickMatch(matches[0]);
        }}
        class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {#if matches.length > 0}
        <ul
          class="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
        >
          {#each matches as match (match.id)}
            <li>
              <button
                type="button"
                onclick={() => pickMatch(match)}
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground hover:bg-foreground/[0.05]"
              >
                {@render kindDot(match.kind)}
                <span class="flex-1 truncate">{match.label}</span>
                <span class="text-xs text-muted">{KIND_LABEL[match.kind]}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Relaciones visibles">
      {#each GROUPS as group (group.id)}
        <button
          type="button"
          aria-pressed={enabled[group.id]}
          onclick={() => (enabled[group.id] = !enabled[group.id])}
          class="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors {enabled[
            group.id
          ]
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-border text-muted hover:text-foreground'}"
        >
          {group.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Grafo -->
  <div
    bind:this={graphEl}
    class="relative h-[70vh] min-h-[460px] w-full overflow-hidden rounded-xl border border-border bg-surface"
  >
    <svg
      bind:this={svgEl}
      viewBox="0 0 {data.width} {data.height}"
      preserveAspectRatio="xMidYMid meet"
      class="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      role="img"
      aria-label="Grafo de conceptos, artículos y autores del sitio"
    >
      <!-- Clic en el fondo: quitar la selección. -->
      <rect
        width={data.width}
        height={data.height}
        fill="transparent"
        onclick={() => selectNode(null, { center: false })}
        role="presentation"
      />
      <g transform="translate({transform.x},{transform.y}) scale({transform.k})">
        <g>
          {#each visibleEdges as edge (edgeKey(edge))}
            {@const a = byId.get(edge.source)!}
            {@const b = byId.get(edge.target)!}
            {@const state = edgeState(edge)}
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              class="edge edge-{edge.type} edge-{state}"
              vector-effect="non-scaling-stroke"
            />
          {/each}
        </g>
        <g>
          {#each visibleNodes as node (node.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <g
              transform="translate({node.x},{node.y})"
              opacity={nodeOpacity(node)}
              class="node cursor-pointer"
              role="button"
              tabindex="-1"
              aria-label="{KIND_LABEL[node.kind]}: {node.label}"
              onpointerenter={() => (hoveredId = node.id)}
              onpointerleave={() => (hoveredId = null)}
              onclick={(event) => {
                event.stopPropagation();
                selectNode(selectedId === node.id ? null : node.id, { center: false });
              }}
            >
              {#if node.kind === "libro"}
                <rect
                  x={-node.r}
                  y={-node.r}
                  width={node.r * 2}
                  height={node.r * 2}
                  transform="rotate(45)"
                  class="shape shape-libro"
                  vector-effect="non-scaling-stroke"
                />
              {:else}
                <circle r={node.r} class="shape shape-{node.kind}" vector-effect="non-scaling-stroke" />
              {/if}
              {#if node.id === selectedId}
                <circle r={node.r + 4} class="ring" vector-effect="non-scaling-stroke" />
              {/if}
              {#if labeled.has(node.id)}
                <text
                  y={-node.r - 4}
                  text-anchor="middle"
                  font-size={labelSize}
                  class="label label-{node.kind}"
                  class:label-focus={node.id === focusId}
                >
                  {labelText(node)}
                </text>
              {/if}
            </g>
          {/each}
        </g>
      </g>
    </svg>

    <!-- Zoom -->
    <div class="absolute left-3 top-3 flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <button type="button" onclick={() => zoomBy(1.4)} class="px-2.5 py-1.5 text-sm text-foreground hover:bg-foreground/[0.05]" aria-label="Acercar">+</button>
      <button type="button" onclick={() => zoomBy(1 / 1.4)} class="border-t border-border px-2.5 py-1.5 text-sm text-foreground hover:bg-foreground/[0.05]" aria-label="Alejar">−</button>
      <button type="button" onclick={resetView} class="border-t border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-foreground/[0.05]" aria-label="Ver todo">⤢</button>
    </div>

    <!-- Leyenda -->
    <div class="pointer-events-none absolute bottom-3 left-3 hidden flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-background/90 px-3 py-2 text-[11px] text-muted backdrop-blur sm:flex">
      {#each LEGEND as kind (kind)}
        <span class="flex items-center gap-1.5">{@render kindDot(kind)} {KIND_LABEL[kind]}</span>
      {/each}
    </div>

    <!-- Panel del nodo seleccionado -->
    {#if selected}
      <aside
        class="absolute inset-x-2 bottom-2 flex max-h-[55%] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:inset-x-auto md:bottom-3 md:right-3 md:top-3 md:max-h-none md:w-80"
        aria-label="Detalle: {selected.label}"
      >
        <div class="flex items-start gap-3 border-b border-border p-4">
          <div class="min-w-0 flex-1">
            <p class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
              {@render kindDot(selected.kind)}
              {KIND_LABEL[selected.kind]} · {selected.degree} conexiones
            </p>
            <h2 class="serif-text mt-1.5 text-lg font-semibold leading-snug text-foreground">
              {selected.label}
            </h2>
          </div>
          <button
            type="button"
            onclick={() => selectNode(null, { center: false })}
            class="shrink-0 rounded-md p-1 text-muted hover:bg-foreground/[0.05] hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          {#if selected.description}
            <p class="text-sm leading-relaxed text-muted">{selected.description}</p>
          {/if}
          {#if selected.url}
            <a
              href={selected.url}
              class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {ACTION_LABEL[selected.kind]} →
            </a>
          {/if}
          {#each connections as group (group.label)}
            <section class="mt-5">
              <h3 class="mb-1.5 flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                <span>{group.label}</span>
                <span class="tabular-nums tracking-normal">{group.items.length}</span>
              </h3>
              <ul class="flex flex-col">
                {#each group.items as item (item.node.id)}
                  <li>
                    <button
                      type="button"
                      onclick={() => selectNode(item.node.id)}
                      onpointerenter={() => (hoveredId = item.node.id)}
                      onpointerleave={() => (hoveredId = null)}
                      class="flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-foreground/[0.05]"
                    >
                      <span class="mt-1.5">{@render kindDot(item.node.kind)}</span>
                      <span class="flex-1 leading-snug">{item.node.label}</span>
                    </button>
                  </li>
                {/each}
              </ul>
            </section>
          {/each}
        </div>
      </aside>
    {/if}
  </div>

  <p class="text-xs text-muted">
    Arrastra para moverte, usa la rueda o los botones para acercarte y toca un punto para ver sus
    conexiones.
  </p>

  <!-- Índice de conceptos: la misma información sin depender del grafo -->
  <section class="mt-10">
    <p class="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted">Conceptos</p>
    <ul class="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
      {#each conceptIndex as concept (concept.id)}
        <li>
          <button
            type="button"
            onclick={() => pickMatch(concept)}
            class="flex w-full items-baseline justify-between gap-3 border-b border-border py-2 text-left transition-colors hover:text-accent"
          >
            <span class="serif-text font-medium">{concept.label}</span>
            <span class="text-xs tabular-nums text-muted">{concept.degree}</span>
          </button>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .edge {
    stroke-width: 1;
    transition: stroke-opacity 150ms;
  }
  .edge-trata {
    stroke: var(--color-muted);
    stroke-opacity: 0.22;
  }
  .edge-relacionado {
    stroke: var(--color-foreground);
    stroke-opacity: 0.22;
    stroke-dasharray: 3 3;
  }
  .edge-desarrolla,
  .edge-responde-a {
    stroke: var(--color-foreground);
    stroke-opacity: 0.45;
  }
  .edge-critica {
    stroke: var(--color-accent);
    stroke-opacity: 0.55;
  }
  .edge-cita {
    stroke: var(--color-muted);
    stroke-opacity: 0.3;
    stroke-dasharray: 1 3;
  }
  .edge-dim {
    stroke-opacity: 0.04;
  }
  .edge-focus {
    stroke: var(--color-accent);
    stroke-opacity: 0.9;
    stroke-width: 1.5;
  }

  .node {
    transition: opacity 150ms;
  }
  .shape-concepto {
    fill: var(--color-accent);
  }
  /* Gris y no el color de texto: en Ledger el acento ES el color de texto,
     y conceptos y artículos se confundirían. */
  .shape-articulo {
    fill: var(--color-muted);
    fill-opacity: 0.75;
  }
  .shape-autor {
    fill: var(--color-surface);
    stroke: var(--color-accent);
    stroke-width: 2;
  }
  .shape-libro {
    fill: var(--color-surface);
    stroke: var(--color-foreground);
    stroke-opacity: 0.7;
    stroke-width: 2;
  }
  .ring {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2;
  }

  .label {
    fill: var(--color-foreground);
    font-family: var(--font-sans);
    font-weight: 600;
    paint-order: stroke;
    stroke: var(--color-surface);
    stroke-width: 3px;
    stroke-linejoin: round;
    pointer-events: none;
  }
  .label-articulo {
    font-weight: 500;
  }
  .label-focus {
    fill: var(--color-accent);
  }

  @media (prefers-reduced-motion: reduce) {
    .edge,
    .node {
      transition: none;
    }
  }
</style>
