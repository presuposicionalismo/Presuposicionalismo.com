<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let title = "Default Title";
  export let highlightedText = "";
  export let description = [];
  export let ctaText = "Explore";
  export let ctaHref = "#";

  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

<section
  class="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center relative not-prose"
>
  {#if visible}
    <div in:fade={{ duration: 800, delay: 200 }}>
      <h1
        class="serif-text text-5xl md:text-7xl font-bold leading-tight mb-8 text-foreground"
      >
        {title}
        {#if highlightedText}
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-accent to-gray-600 block sm:inline mt-2 sm:mt-0"
          >
            {highlightedText}?
          </span>
        {/if}
      </h1>
    </div>

    <div
      in:fly={{ y: 20, duration: 800, delay: 600 }}
      class="space-y-6 max-w-2xl mx-auto"
    >
      {#each description as paragraph}
        <p class="text-xl text-muted leading-relaxed font-light">
          {paragraph}
        </p>
      {/each}
    </div>

    <div
      in:fly={{ y: 20, duration: 800, delay: 900 }}
      class="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
    >
      <a
        href={ctaHref}
        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-background text-lg font-medium rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
      >
        <span>{ctaText}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </a>

      <a
        href="/clases"
        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface text-accent border-2 border-accent text-lg font-medium rounded-lg hover:bg-accent hover:text-background transition-all"
      >
        Ver Programa
      </a>
    </div>
  {/if}
</section>
