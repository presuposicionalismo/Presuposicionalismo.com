<script>
  import { onMount } from "svelte";

  let isOpen = false;
  let spanElement;
  let noteElement;
  let leftOffset = 0;

  function updatePosition() {
    if (!spanElement || typeof window === "undefined") return;

    if (window.matchMedia("(min-width: 1024px)").matches) {
      const proseContainer = spanElement.closest(".prose-content");

      if (proseContainer) {
        const proseRect = proseContainer.getBoundingClientRect();
        const spanRect = spanElement.getBoundingClientRect();

        // Calculate distance from the span to the RIGHT edge of the prose container
        const distanceToEdge = proseRect.right - spanRect.right;

        // Add a gap (e.g., 2rem) and set the placement
        leftOffset = distanceToEdge + 32; // 32px = 2rem gap
      }
    }
  }

  onMount(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  });
</script>

<span class="inline relative group" bind:this={spanElement}>
  <button
    class="align-top text-xs text-accent font-bold hover:underline cursor-pointer select-none lg:pointer-events-none"
    on:click={() => (isOpen = !isOpen)}
    aria-label="Ver nota al margen"
  >
    <span
      class="text-[10px] bg-accent/10 px-1 rounded-sm border border-accent/20 text-accent"
      >NOTE</span
    >
  </button>

  <span
    bind:this={noteElement}
    role="note"
    style="--left-offset: {leftOffset}px;"
    class="
      {isOpen ? 'block' : 'hidden'} 
      lg:block
      mt-2 lg:mt-0
      w-full lg:w-64
      lg:absolute lg:top-0
      lg:left-(--left-offset)
      p-3 lg:p-0
      bg-surface lg:bg-transparent
      border border-border lg:border-0 lg:border-l-2 lg:border-accent/30
      text-sm text-muted
      rounded-md lg:rounded-none lg:pl-4
      shadow-sm lg:shadow-none
      lg:text-sm lg:leading-tight
      not-prose z-10
    "
  >
    <slot />
  </span>
</span>
