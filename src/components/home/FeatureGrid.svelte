<script>
  export let features = [
    {
      title: "Blog",
      description:
        "Artículos y ensayos sobre apologética, teología y cultura desde una perspectiva reformada.",
      icon: "article",
      href: "/blog",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Programa de Estudio",
      description:
        "Un currículo estructurado de lecciones interactivas para dominar la apologética presuposicional.",
      icon: "school",
      href: "/clases",
      color:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Recursos",
      description:
        "Libros recomendados, traducciones y documentos clave para profundizar tu estudio.",
      icon: "library_books",
      href: "/recursos",
      color:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
  ];
</script>

<section class="max-w-6xl mx-auto px-6 py-12">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each features as feature}
      <a
        href={feature.href}
        class="group p-8 rounded-2xl bg-surface border border-border hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4"
      >
        <div
          class={`p-4 rounded-xl ${feature.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
        >
          <span class="material-icons-outlined text-3xl">{feature.icon}</span>
        </div>

        <h3
          class="text-2xl font-bold text-foreground group-hover:text-accent transition-colors"
        >
          {feature.title}
        </h3>

        <p class="text-muted leading-relaxed">
          {feature.description}
        </p>

        <span
          class="mt-auto pt-4 text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform"
        >
          Explorar
          <span class="material-icons-outlined text-base">arrow_forward</span>
        </span>
      </a>
    {/each}
  </div>
</section>
