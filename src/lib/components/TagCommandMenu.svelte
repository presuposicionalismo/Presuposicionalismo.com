<script lang="ts">
  import { onMount } from "svelte";
  import { Dialog, Command, ScrollArea } from "bits-ui";
  import { slugifyStr } from "@utils/slugify";

  interface Author {
    name: string;
    slug: string;
  }

  interface Props {
    tags: string[];
    activeTag?: string;
    authors?: Author[];
  }

  let { tags, activeTag, authors = [] }: Props = $props();

  let open = $state(false);

  function goTo(href: string) {
    open = false;
    window.location.href = href;
  }

  onMount(() => {
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

<button
  type="button"
  onclick={() => (open = true)}
  class="group flex w-full max-w-sm items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted shadow-sm transition-colors hover:border-accent/40 hover:text-foreground"
>
  <svg
    class="shrink-0 text-base"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </svg>
  <span class="flex-1 truncate text-left">
    {activeTag ? `Etiqueta: ${activeTag}` : "Filtrar por etiqueta o autor..."}
  </span>
  <kbd
    class="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline-flex"
  >
    <span>⌘</span>K
  </kbd>
</button>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm" />
    <Dialog.Content
      class="fixed left-1/2 top-24 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
    >
      <Dialog.Title class="sr-only">Filtrar artículos por etiqueta o autor</Dialog.Title>
      <Dialog.Description class="sr-only">
        Buscá una etiqueta o un autor y presioná Enter para ir ahí.
      </Dialog.Description>

      <Command.Root class="flex flex-col">
        <div class="flex items-center gap-2.5 border-b border-border px-4">
          <svg
            class="shrink-0 text-muted"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
          <Command.Input
            placeholder="Buscar etiqueta o autor..."
            class="w-full bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
        </div>

        <Command.List>
          <ScrollArea.Root type="auto">
            <ScrollArea.Viewport class="max-h-80 p-2">
              <Command.Empty class="py-8 text-center text-sm text-muted">
                No se encontró nada.
              </Command.Empty>

              <Command.Group>
                <Command.GroupHeading
                  class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Etiquetas
                </Command.GroupHeading>
                {#if activeTag}
                  <Command.LinkItem
                    href="/blog"
                    onSelect={() => goTo("/blog")}
                    class="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-muted data-[selected]:bg-accent/10 data-[selected]:text-accent"
                  >
                    Quitar filtro (ver todos los artículos)
                  </Command.LinkItem>
                {/if}
                {#each tags as tag (tag)}
                  <Command.LinkItem
                    href={`/tags/${slugifyStr(tag)}`}
                    onSelect={() => goTo(`/tags/${slugifyStr(tag)}`)}
                    value={tag}
                    class="flex cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-2.5 text-sm capitalize data-[selected]:bg-accent/10 data-[selected]:text-accent {tag ===
                    activeTag
                      ? 'font-semibold text-accent'
                      : 'text-foreground'}"
                  >
                    <span class="flex items-center gap-2.5">
                      <svg
                        class="shrink-0 text-muted"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        <path
                          d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3"
                        />
                      </svg>
                      {tag}
                    </span>
                    {#if tag === activeTag}
                      <svg
                        class="shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    {/if}
                  </Command.LinkItem>
                {/each}
              </Command.Group>

              {#if authors.length > 0}
                <Command.Group>
                  <Command.GroupHeading
                    class="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Autores
                  </Command.GroupHeading>
                  {#each authors as author (author.slug)}
                    <Command.LinkItem
                      href={`/autores/${author.slug}`}
                      onSelect={() => goTo(`/autores/${author.slug}`)}
                      value={author.name}
                      class="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-foreground data-[selected]:bg-accent/10 data-[selected]:text-accent"
                    >
                      <svg
                        class="shrink-0 text-muted"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                      {author.name}
                    </Command.LinkItem>
                  {/each}
                </Command.Group>
              {/if}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              class="flex w-2 touch-none select-none p-0.5"
            >
              <ScrollArea.Thumb class="flex-1 rounded-full bg-muted/40" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Command.List>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
