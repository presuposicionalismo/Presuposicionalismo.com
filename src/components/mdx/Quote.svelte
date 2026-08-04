<script>
  export let type = "default"; // default, bible, poetry, testimonio
  export let author = "";
  export let reference = "";

  // Computed (not literal template whitespace) so the build's HTML
  // compressor can't trim it away like it does with a bare ", " sitting
  // between two conditional blocks.
  $: authorSeparator = author && reference ? ", " : "";
</script>

<div class="my-8 not-prose">
  {#if type === "bible"}
    <div class="bg-surface border-l-4 border-accent p-6 rounded-r-lg shadow-sm">
      <div
        class="font-serif text-xl italic text-foreground mb-4 leading-relaxed"
      >
        <span class="text-accent text-3xl font-bold mr-1">“</span><slot /><span
          class="text-accent text-3xl font-bold ml-1">”</span
        >
      </div>
      {#if reference || author}
        <div
          class="flex items-center justify-end text-sm font-semibold text-accent uppercase tracking-wider"
        >
          <span class="mr-2">—</span>
          {#if author}<span>{author}</span>{/if}
          {#if author && reference}<span class="mx-1">,</span>{/if}
          {#if reference}<span>{reference}</span>{/if}
        </div>
      {/if}
    </div>
  {:else if type === "poetry"}
    <div
      class="bg-surface border-y border-border p-8 text-center italic font-serif text-lg text-foreground"
    >
      <div class="whitespace-pre-line leading-loose">
        <slot />
      </div>
      {#if author}
        <div class="mt-6 text-sm not-italic font-sans text-muted">
          — {author}
        </div>
      {/if}
    </div>
  {:else if type === "testimonio"}
    <!-- Testimonial card: endorsements / recommendations from third parties -->
    <figure
      class="relative rounded-2xl border border-border bg-surface p-8 shadow-sm md:p-10"
    >
      <span
        aria-hidden="true"
        class="serif-text absolute -top-3 left-6 text-7xl leading-none text-accent/25 select-none"
        >&ldquo;</span
      >
      <blockquote class="relative">
        <div
          class="serif-text text-xl italic leading-relaxed text-foreground md:text-2xl"
        >
          <slot />
        </div>
      </blockquote>
      {#if author || reference}
        <figcaption
          class="mt-6 flex items-start gap-3 border-t border-border pt-4 text-sm text-muted"
        >
          <span class="text-accent" aria-hidden="true">—</span>
          <span class="not-italic">
            {#if author}<span class="font-medium text-foreground"
                >{author}</span
              >{/if}{authorSeparator}{#if reference}<span>{reference}</span
            >{/if}
          </span>
        </figcaption>
      {/if}
    </figure>
  {:else}
    <!-- Default Quote -->
    <blockquote
      class="relative p-6 pl-12 border-l-4 border-accent bg-surface rounded-r-lg shadow-sm"
    >
      <svg
        class="absolute top-6 left-4 w-6 h-6 text-accent/20 transform -scale-x-100"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path
          d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
        />
      </svg>
      <div class="text-lg font-medium italic text-foreground mb-2">
        <slot />
      </div>
      {#if author || reference}
        <footer class="text-sm font-semibold text-accent">
          — {author}{#if reference}, <cite
              class="not-italic font-normal text-muted">{reference}</cite
            >{/if}
        </footer>
      {/if}
    </blockquote>
  {/if}
</div>
