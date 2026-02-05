<script>
  export let title = "Lo Último";
  export let items = []; // Expects array of { title, description, date, href, image }
</script>

<section class="max-w-7xl mx-auto px-6 py-20 border-t border-border">
  <div class="flex items-end justify-between mb-12">
    <h2 class="font-serif text-4xl text-accent font-bold">
      {title}
    </h2>
    <a
      href="/blog"
      class="hidden md:flex items-center gap-2 text-accent font-medium hover:underline"
    >
      Ver todo
      <span class="material-icons-outlined">arrow_forward</span>
    </a>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each items as item}
      <article
        class="group flex flex-col h-full bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border"
      >
        {#if item.image}
          <div class="relative w-full aspect-video overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300"
            ></div>
          </div>
        {/if}

        <div class="flex-1 p-6 flex flex-col">
          <div
            class="text-xs font-bold text-accent/60 mb-3 uppercase tracking-wider"
          >
            {item.date}
          </div>

          <h3
            class="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors"
          >
            <a href={item.href} class="before:absolute before:inset-0">
              {item.title}
            </a>
          </h3>

          <p class="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>

          <div
            class="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm"
          >
            <span class="text-accent font-medium group-hover:underline"
              >Leer más</span
            >
            <span
              class="material-icons-outlined text-accent transform group-hover:translate-x-1 transition-transform"
            >
              arrow_right_alt
            </span>
          </div>
        </div>
      </article>
    {/each}
  </div>

  <div class="mt-12 text-center md:hidden">
    <a
      href="/blog"
      class="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-lg text-accent font-medium"
    >
      Ver todo el contenido
    </a>
  </div>
</section>
