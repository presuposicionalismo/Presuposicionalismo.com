<script>
  import mermaid from "mermaid";
  import { onMount } from "svelte";

  export let chart = "";

  let container;
  let id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  onMount(async () => {
    mermaid.initialize({ startOnLoad: false, theme: "default" });
    const { svg } = await mermaid.render(id, chart);
    container.innerHTML = svg;
  });
</script>

<div class="my-8 flex justify-center not-prose overflow-x-auto">
  <div bind:this={container} class="mermaid-container">
    <!-- SVG renderizado aquí -->
  </div>
</div>
