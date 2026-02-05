<script>
  export let items = [];
  export let title = "Esquema de la Lección";
</script>

<div class="relative not-prose my-8 lg:my-0 lg:w-full">
  <div
    class="
      lg:sticky lg:top-24 w-full h-auto
      bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700
      p-6
    "
  >
    <h3
      class="font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs flex items-center gap-2"
    >
      <span class="material-icons-outlined text-sm">toc</span>
      {title}
    </h3>
    <ul class="space-y-3">
      {#each items as item, i}
        {#if typeof item === "string"}
          <!-- Legacy string support -->
          <li class="flex items-start text-sm">
            <span
              class="shrink-0 flex items-center justify-center w-5 h-5 mr-3 text-xs font-bold text-accent bg-accent/10 rounded-full mt-0.5"
            >
              {i + 1}
            </span>
            <span
              class="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors cursor-default"
            >
              {item}
            </span>
          </li>
        {:else}
          <!-- Astro Headings support -->
          {#if item.depth <= 3}
            <li class="flex items-start text-sm" class:pl-4={item.depth > 2}>
              <a
                href="#{item.slug}"
                class="block w-full text-gray-600 dark:text-gray-400 hover:text-accent hover:underline transition-colors"
              >
                {#if item.depth === 2}
                  <span class="font-bold text-accent mr-1">#</span>
                {/if}
                {item.text}
              </a>
            </li>
          {/if}
        {/if}
      {/each}
    </ul>
  </div>
</div>
