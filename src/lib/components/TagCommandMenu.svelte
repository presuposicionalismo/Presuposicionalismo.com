<script lang="ts">
  import { onMount } from "svelte";
  import { Dialog, Command, ScrollArea } from "bits-ui";
  import { slugifyStr } from "@utils/slugify";
  import {
    loadPresets,
    matchPresets,
    preloadSearch,
    searchArticles,
    type ArticleHit,
    type Preset,
  } from "@utils/search";

  interface Author {
    name: string;
    slug: string;
    role?: string;
  }

  interface Props {
    tags: string[];
    activeTag?: string;
    authors?: Author[];
    tagCounts?: Record<string, number>;
  }

  let { tags, activeTag, authors = [], tagCounts = {} }: Props = $props();

  type Category = "search" | "tags" | "authors";
  const categories: { id: Category; label: string }[] = [
    { id: "search", label: "Buscar" },
    { id: "tags", label: "Etiquetas" },
    { id: "authors", label: "Autores" },
  ];

  let open = $state(false);
  let activeCategory = $state<Category>("search");
  let query = $state("");
  let inputEl = $state<HTMLInputElement | null>(null);
  let isMac = $state(false);

  // Pestaña "Buscar": presets precalculados + texto completo (Pagefind).
  let presets = $state<Preset[]>([]);
  let articles = $state<ArticleHit[]>([]);
  let searching = $state(false);
  // Sin texto se muestran solo las primeras (las más generales del índice);
  // el resto aparece al escribir.
  const FEATURED_PRESETS = 8;

  let term = $derived(query.trim());
  let suggested = $derived(matchPresets(presets, term)[0]);
  let suggestedUrls = $derived(
    new Set(suggested?.results.map((r) => r.url.split("#")[0]) ?? []),
  );
  let otherArticles = $derived(articles.filter((a) => !suggestedUrls.has(a.url)));
  let noResults = $derived(
    term.length >= 2 && !searching && !suggested && otherArticles.length === 0,
  );

  $effect(() => {
    if (!open) return;
    preloadSearch();
    loadPresets().then((loaded) => (presets = loaded));
  });

  $effect(() => {
    const current = term;
    if (activeCategory !== "search" || current.length < 2) {
      articles = [];
      searching = false;
      return;
    }
    searching = true;
    searchArticles(current).then((hits) => {
      // null: la reemplazó una búsqueda más reciente, que apagará `searching`.
      if (hits && term === current) {
        articles = hits;
        searching = false;
      }
    });
  });

  function goTo(href: string) {
    open = false;
    window.location.href = href;
  }

  function selectCategory(category: Category) {
    activeCategory = category;
    inputEl?.focus();
  }

  function clearQuery() {
    query = "";
    inputEl?.focus();
  }

  const tagLabel = (tag: string) => tag.replaceAll("-", " ");
  // Nombre y apellido, sin iniciales intermedias ("Greg L. Bahnsen" -> "GB")
  // y respetando partículas del apellido ("Cornelius Van Til" -> "CV").
  const SURNAME_PARTICLES = new Set(["van", "de", "del", "von", "der"]);
  const initials = (name: string) => {
    const parts = name.split(/\s+/).filter((part) => part.replace(".", "").length > 1);
    const particle = parts.findIndex((part, i) => i > 0 && SURNAME_PARTICLES.has(part.toLowerCase()));
    const surname = particle > 0 ? parts[particle] : parts.at(-1);
    return `${parts[0]?.[0] ?? ""}${surname?.[0] ?? ""}`;
  };

  onMount(() => {
    isMac = /Mac|iPhone|iPad/.test(navigator.platform);

    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open = !open;
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
</script>

{#snippet sectionHeading(label: string, count?: number)}
  <Command.GroupHeading
    class="flex items-baseline justify-between px-3 pb-2 pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted"
  >
    <span>{label}</span>
    {#if count !== undefined}
      <span class="tabular-nums tracking-normal">{count}</span>
    {/if}
  </Command.GroupHeading>
{/snippet}

{#snippet searchIcon(cls: string)}
  <svg
    class={cls}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </svg>
{/snippet}

<button
  type="button"
  onclick={() => (open = true)}
  class="group flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-muted shadow-sm transition-colors hover:border-foreground/30 hover:text-foreground"
>
  {@render searchIcon("shrink-0 text-base")}
  <span class="flex-1 truncate">
    {#if activeTag}
      Etiqueta: <span class="font-semibold capitalize text-foreground">{tagLabel(activeTag)}</span>
    {:else}
      Buscar un tema, una pregunta o un autor…
    {/if}
  </span>
  <kbd
    class="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted sm:inline-flex"
  >
    {isMac ? "⌘" : "Ctrl"} K
  </kbd>
</button>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-[100] bg-foreground/30 backdrop-blur-sm" />
    <Dialog.Content
      class="search-dialog fixed left-1/2 top-4 z-[101] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl sm:top-[12vh] sm:max-h-[76vh]"
    >
      <Dialog.Title class="sr-only">Buscar artículos, etiquetas o autores</Dialog.Title>
      <Dialog.Description class="sr-only">
        Escribe un tema o una pregunta, o elige una etiqueta o un autor, y presiona Enter para ir.
      </Dialog.Description>

      <!-- En "Buscar" el filtrado lo hacen los presets y Pagefind, no bits-ui. -->
      <Command.Root
        class="flex min-h-0 flex-1 flex-col"
        shouldFilter={activeCategory !== "search"}
        loop
      >
        <div class="flex items-center gap-3 border-b border-border px-4 sm:px-5">
          {#if searching}
            <span
              class="size-4 shrink-0 animate-spin rounded-full border-2 border-muted/30 border-t-accent"
              aria-hidden="true"
            ></span>
          {:else}
            {@render searchIcon("shrink-0 text-lg text-muted")}
          {/if}
          <Command.Input
            bind:ref={inputEl}
            bind:value={query}
            placeholder={activeCategory === "search"
              ? "¿Qué quieres saber?"
              : activeCategory === "tags"
                ? "Filtrar etiquetas…"
                : "Filtrar autores…"}
            class="w-full min-w-0 bg-transparent py-4 text-base text-foreground placeholder:text-muted focus:outline-none sm:py-5"
          />
          {#if query}
            <button
              type="button"
              onclick={clearQuery}
              class="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Borrar búsqueda"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          {/if}
          <Dialog.Close
            class="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted transition-colors hover:text-foreground sm:block"
          >
            Esc
          </Dialog.Close>
        </div>

        <div class="flex gap-1 border-b border-border px-3 py-2 sm:px-4" role="tablist">
          {#each categories as category (category.id)}
            {#if category.id !== "authors" || authors.length > 0}
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                onclick={() => selectCategory(category.id)}
                class="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors {activeCategory ===
                category.id
                  ? 'bg-accent text-background'
                  : 'text-muted hover:bg-surface hover:text-foreground'}"
              >
                {category.label}
              </button>
            {/if}
          {/each}
        </div>

        <Command.List class="min-h-0 flex-1">
          <ScrollArea.Root type="auto" class="h-full">
            <ScrollArea.Viewport class="max-h-[calc(100dvh-10.5rem)] sm:max-h-[min(60vh,34rem)] px-2 pb-3 sm:px-3">
              {#if activeCategory === "search"}
                {#if term === ""}
                  <Command.Group>
                    {@render sectionHeading("Preguntas frecuentes")}
                    <Command.GroupItems>
                      {#each presets.slice(0, FEATURED_PRESETS) as preset (preset.text)}
                        <Command.Item
                          value={preset.text}
                          onSelect={() => (query = preset.text)}
                          class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground data-[selected]:bg-foreground/[0.05]"
                        >
                          <span
                            class="serif-text flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent"
                            aria-hidden="true">?</span
                          >
                          <span class="flex-1">{preset.text}</span>
                        </Command.Item>
                      {/each}
                    </Command.GroupItems>
                  </Command.Group>
                {:else}
                  {#if suggested}
                    <Command.Group>
                      <Command.GroupHeading class="px-3 pb-3 pt-4">
                        <span
                          class="block text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
                        >
                          Respuesta sugerida
                        </span>
                        <span
                          class="serif-text mt-1 block text-lg font-semibold leading-snug text-foreground"
                        >
                          {suggested.text}
                        </span>
                      </Command.GroupHeading>
                      <Command.GroupItems>
                        {#each suggested.results as result, i (`${i}:${result.url}`)}
                          <Command.LinkItem
                            href={result.url}
                            value={`sugerido ${i} ${result.url}`}
                            onSelect={() => goTo(result.url)}
                            class="group/item flex cursor-pointer gap-3 rounded-md px-3 py-3 data-[selected]:bg-foreground/[0.05]"
                          >
                            <span
                              class="w-0.5 shrink-0 rounded-full bg-border transition-colors group-data-[selected]/item:bg-accent"
                              aria-hidden="true"
                            ></span>
                            <span class="flex min-w-0 flex-col gap-1">
                              <span class="serif-text font-semibold leading-snug text-foreground">
                                {result.title}
                              </span>
                              <span class="line-clamp-2 text-sm leading-relaxed text-muted">
                                “{result.snippet}”
                              </span>
                              {#if result.url.includes("#")}
                                <span class="text-xs font-semibold text-accent">Ir a la sección →</span>
                              {/if}
                            </span>
                          </Command.LinkItem>
                        {/each}
                      </Command.GroupItems>
                    </Command.Group>
                  {/if}

                  {#if otherArticles.length > 0}
                    <Command.Group>
                      {@render sectionHeading(
                        suggested ? "Otros artículos" : "Artículos",
                        otherArticles.length,
                      )}
                      <Command.GroupItems>
                        {#each otherArticles as article (article.url)}
                          <Command.LinkItem
                            href={article.url}
                            value={article.url}
                            onSelect={() => goTo(article.url)}
                            class="flex cursor-pointer flex-col gap-1 rounded-md px-3 py-3 data-[selected]:bg-foreground/[0.05] [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-foreground [&_mark]:underline [&_mark]:decoration-accent [&_mark]:decoration-2 [&_mark]:underline-offset-2"
                          >
                            <span class="serif-text font-semibold leading-snug text-foreground">
                              {article.title}
                            </span>
                            <!-- Extracto de nuestro propio índice de Pagefind (solo <mark>). -->
                            <span class="line-clamp-2 text-sm leading-relaxed text-muted">
                              {@html article.excerpt}
                            </span>
                          </Command.LinkItem>
                        {/each}
                      </Command.GroupItems>
                    </Command.Group>
                  {/if}

                  {#if searching && !suggested && otherArticles.length === 0}
                    <p class="px-3 py-10 text-center text-sm text-muted">Buscando…</p>
                  {:else if noResults}
                    <div class="flex flex-col items-center gap-3 px-6 py-10 text-center">
                      <p class="text-sm text-foreground">
                        No encontramos nada para <span class="font-semibold">“{term}”</span>.
                      </p>
                      <p class="text-sm text-muted">Prueba con otras palabras o explora por etiqueta.</p>
                      <button
                        type="button"
                        onclick={() => {
                          query = "";
                          selectCategory("tags");
                        }}
                        class="mt-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
                      >
                        Ver etiquetas
                      </button>
                    </div>
                  {:else if term.length === 1}
                    <p class="px-3 py-10 text-center text-sm text-muted">Sigue escribiendo…</p>
                  {/if}
                {/if}
              {:else}
                <Command.Empty class="px-3 py-10 text-center text-sm text-muted">
                  No se encontró nada.
                </Command.Empty>

                {#if activeCategory === "tags"}
                  <Command.Group>
                    {@render sectionHeading("Etiquetas", tags.length)}
                    <Command.GroupItems class="flex flex-wrap gap-2 px-2 pb-1">
                      {#if activeTag}
                        <Command.LinkItem
                          href="/blog"
                          value="quitar filtro ver todos"
                          onSelect={() => goTo("/blog")}
                          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted data-[selected]:border-accent data-[selected]:text-accent"
                        >
                          × Quitar filtro
                        </Command.LinkItem>
                      {/if}
                      {#each tags as tag (tag)}
                        <Command.LinkItem
                          href={`/tags/${slugifyStr(tag)}`}
                          onSelect={() => goTo(`/tags/${slugifyStr(tag)}`)}
                          value={tagLabel(tag)}
                          class="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors data-[selected]:border-accent data-[selected]:bg-accent/10 data-[selected]:text-accent {tag ===
                          activeTag
                            ? 'border-accent bg-accent/10 font-semibold text-accent'
                            : 'border-border text-foreground'}"
                        >
                          {tagLabel(tag)}
                          {#if tagCounts[tag]}
                            <span class="text-xs tabular-nums text-muted">{tagCounts[tag]}</span>
                          {/if}
                        </Command.LinkItem>
                      {/each}
                    </Command.GroupItems>
                  </Command.Group>
                {:else}
                  <Command.Group>
                    {@render sectionHeading("Autores", authors.length)}
                    <Command.GroupItems>
                      {#each authors as author (author.slug)}
                        <Command.LinkItem
                          href={`/autores/${author.slug}`}
                          onSelect={() => goTo(`/autores/${author.slug}`)}
                          value={author.name}
                          class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 data-[selected]:bg-foreground/[0.05]"
                        >
                          <span
                            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent"
                            aria-hidden="true"
                          >
                            {initials(author.name)}
                          </span>
                          <span class="flex min-w-0 flex-col">
                            <span class="serif-text font-semibold text-foreground">{author.name}</span>
                            {#if author.role}
                              <span class="truncate text-xs text-muted">{author.role}</span>
                            {/if}
                          </span>
                        </Command.LinkItem>
                      {/each}
                    </Command.GroupItems>
                  </Command.Group>
                {/if}
              {/if}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" class="flex w-2 touch-none select-none p-0.5">
              <ScrollArea.Thumb class="flex-1 rounded-full bg-muted/40" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Command.List>

        <div
          class="hidden items-center gap-4 border-t border-border bg-surface px-5 py-2.5 text-[11px] text-muted sm:flex"
        >
          <span><kbd class="font-sans font-semibold">↑↓</kbd> navegar</span>
          <span><kbd class="font-sans font-semibold">↵</kbd> abrir</span>
          <span><kbd class="font-sans font-semibold">esc</kbd> cerrar</span>
        </div>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  /* bits-ui monta el diálogo en un portal, fuera del alcance de los estilos
     con scope de este componente: de ahí el :global. */
  :global(.search-dialog) {
    animation: search-dialog-in 160ms ease-out;
  }

  @keyframes search-dialog-in {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.985);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.search-dialog) {
      animation: none;
    }
  }
</style>
