<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import * as d3 from "d3";
  import type {
    GraphNode as BaseGraphNode,
    GraphLink as BaseGraphLink,
  } from "../utils/graphData";

  const dispatch = createEventDispatcher();

  // Extend base types with D3 simulation properties
  interface GraphNode extends BaseGraphNode, d3.SimulationNodeDatum {}
  interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    source: string | GraphNode;
    target: string | GraphNode;
    value: number;
  }

  export let nodes: BaseGraphNode[] = [];
  export let links: BaseGraphLink[] = [];

  let svg: SVGSVGElement;
  let width = 800;
  let height = 600;
  let container: HTMLDivElement;
  let searchTerm = "";

  // Internal state for D3
  let simulation: d3.Simulation<GraphNode, GraphLink>;
  let g: d3.Selection<SVGGElement, unknown, null, undefined>;
  let linkSelection: d3.Selection<SVGLineElement, GraphLink, any, unknown>;
  let nodeSelection: d3.Selection<SVGCircleElement, GraphNode, any, unknown>;

  // Deep copy to prevent D3 from mutating original props permanently preventing re-filtering
  function getFreshData() {
    return {
      currentNodes: nodes.map((n) => ({ ...n })) as GraphNode[],
      currentLinks: links.map((l) => ({ ...l })) as GraphLink[],
    };
  }

  $: filteredData = (() => {
    const { currentNodes, currentLinks } = getFreshData();
    if (!searchTerm) return { nodes: currentNodes, links: currentLinks };

    const lowerTerm = searchTerm.toLowerCase();
    const matchingNodes = currentNodes.filter(
      (n) =>
        n.title.toLowerCase().includes(lowerTerm) ||
        (n.group === "tag" && n.title.toLowerCase().includes(lowerTerm)),
    );
    const matchingNodeIds = new Set(matchingNodes.map((n) => n.id));

    const matchingLinks = currentLinks.filter(
      (l) =>
        matchingNodeIds.has(l.source as string) &&
        matchingNodeIds.has(l.target as string),
    );

    // Optionally include neighbors of matched nodes?
    // For now, strict filtering.

    return { nodes: matchingNodes, links: matchingLinks };
  })();

  function updateGraph() {
    if (!svg || !g) return;

    const { nodes: simNodes, links: simLinks } = filteredData;

    // Update simulation
    simulation.nodes(simNodes);
    (
      simulation.force("link") as d3.ForceLink<
        d3.SimulationNodeDatum,
        d3.SimulationLinkDatum<d3.SimulationNodeDatum>
      >
    ).links(simLinks);
    simulation.alpha(1).restart();

    // Render Loop (Join)
    // Links
    linkSelection = g
      .select(".links")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(simLinks, (d: any) => d.source.id + "-" + d.target.id);

    linkSelection.exit().remove();

    const linkEnter = linkSelection
      .enter()
      .append("line")
      .attr("stroke", "var(--color-muted)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    linkSelection = linkEnter.merge(linkSelection);

    // Nodes
    nodeSelection = g
      .select(".nodes")
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(simNodes, (d) => d.id);

    nodeSelection.exit().transition().duration(300).attr("r", 0).remove();

    const nodeEnter = nodeSelection
      .enter()
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) =>
        d.group === "post" ? "var(--color-accent)" : "var(--color-muted)",
      ) // Posts = Accent, Tags = Muted/Secondary
      .attr("stroke", "var(--color-background)")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    nodeEnter
      .transition()
      .duration(300)
      .attr("r", (d) => (d.group === "post" ? 6 : 4));

    // Dispatcher moved to top level

    // ... (rest of code)

    nodeEnter.on("click", (event, d) => {
      // Internal interaction: Filter tags
      if (d.group === "tag") {
        searchTerm = d.title.replace("#", "");
      }

      // External interaction: Emit event for generic handling
      dispatch("nodeClick", { node: d, originalEvent: event });
    });

    nodeEnter.append("title").text((d) => d.title);

    nodeSelection = nodeEnter.merge(nodeSelection);
  }

  // Reactive trigger
  $: if (simulation && filteredData) {
    updateGraph();
  }

  onMount(() => {
    if (!container) return;
    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (simulation)
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
    };
    resize();
    window.addEventListener("resize", resize);

    // Init SVG groups
    const svgSel = d3.select(svg);
    g = svgSel.append("g");
    g.append("g").attr("class", "links");
    g.append("g").attr("class", "nodes");

    // Zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svgSel.call(zoom as any);

    // Init Simulation
    simulation = d3
      .forceSimulation<GraphNode>()
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>()
          .id((d) => d.id)
          .distance(50),
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15));

    simulation.on("tick", () => {
      if (linkSelection) {
        linkSelection
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);
      }
      if (nodeSelection) {
        nodeSelection.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      }
    });

    // Initial Render
    updateGraph();

    return () => {
      simulation.stop();
      window.removeEventListener("resize", resize);
    };
  });

  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
</script>

<div class="flex flex-col gap-4 font-sans">
  <div class="relative">
    <input
      type="text"
      bind:value={searchTerm}
      placeholder="Filtrar nodos..."
      class="w-full p-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
    />
    {#if searchTerm}
      <button
        class="absolute right-2 top-2 text-muted hover:text-foreground"
        on:click={() => (searchTerm = "")}
      >
        ✕
      </button>
    {/if}
  </div>

  <div
    class="w-full h-[600px] border border-border rounded-lg overflow-hidden bg-surface shadow-sm"
    bind:this={container}
  >
    <svg bind:this={svg} {width} {height} class="w-full h-full"></svg>
  </div>

  <div class="flex gap-4 text-sm text-muted justify-center">
    <div class="flex items-center gap-2">
      <span
        class="w-3 h-3 rounded-full"
        style="background-color: var(--color-accent)"
      ></span> Posts
    </div>
    <div class="flex items-center gap-2">
      <span
        class="w-3 h-3 rounded-full"
        style="background-color: var(--color-muted)"
      ></span> Tags
    </div>
  </div>
</div>
