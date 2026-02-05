<script>
  export let type = "default"; // default, bible, poetry
  export let author = "";
  export let reference = "";
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
