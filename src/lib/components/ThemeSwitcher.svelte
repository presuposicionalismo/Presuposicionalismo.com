<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { cn } from "../utils";
  import { slide } from "svelte/transition";

  type ThemeOption = {
    value: string;
    label: string;
    description: string;
    color: string;
  };

  const themes: ThemeOption[] = [
    {
      value: "theme-neutral-mono",
      label: "Neutral Mono",
      description: "Monocromatico claro/oscuro",
      color: "bg-white border-black dark:bg-black dark:border-white",
    },
    {
      value: "theme-neutral-soft",
      label: "Neutral Soft",
      description: "Neutro con acento sutil",
      color: "bg-[#f3f2ee] border-[#6b7280]",
    },
  ];

  let currentTheme = "theme-neutral-mono";
  let isOpen = false;
  let rootEl: HTMLDivElement | null = null;
  const isKnownTheme = (value: string | null): value is string =>
    Boolean(value && themes.some((theme) => theme.value === value));

  $: selectedTheme =
    themes.find((theme) => theme.value === currentTheme) ?? themes[themes.length - 1];

  onMount(() => {
    // Check for saved theme (branding) - Key: "design-system"
    const saved = localStorage.getItem("design-system");
    if (isKnownTheme(saved)) {
      currentTheme = saved;
      applyTheme(saved);
    } else {
      applyTheme(currentTheme);
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!isOpen || !rootEl) {
        return;
      }

      if (!rootEl.contains(event.target as Node)) {
        isOpen = false;
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        isOpen = false;
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    onDestroy(() => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    });
  });

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function applyTheme(theme: string) {
    currentTheme = theme;
    localStorage.setItem("design-system", theme);

    const body = document.body;
    Array.from(body.classList).forEach((className) => {
      if (className.startsWith("theme-")) {
        body.classList.remove(className);
      }
    });

    body.classList.add(theme);
  }
</script>

<div class="relative" bind:this={rootEl}>
  <button
    onclick={toggleOpen}
    class="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
    aria-label="Change Theme"
    aria-expanded={isOpen}
  >
    <svg
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z"></path>
      <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7"></path>
      <path d="M7 17h.01"></path>
      <path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8"></path>
    </svg>
  </button>

  {#if isOpen}
    <div
      transition:slide={{ duration: 180, axis: "y" }}
      class="absolute right-0 top-full mt-3 w-72 bg-popover/95 backdrop-blur-xl border border-border/70 shadow-2xl rounded-2xl p-3 z-50 origin-top-right"
    >
      <div class="px-1 pb-2 border-b border-border/60">
        <p class="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
          Apariencia
        </p>
        <p class="text-xs mt-1 text-foreground/80">
          Tema actual: <span class="font-semibold">{selectedTheme.label}</span>
        </p>
      </div>

      <div class="max-h-72 overflow-y-auto mt-2 pr-1 space-y-1.5 theme-switcher-scroll">
        {#each themes as theme}
          <button
            onclick={() => {
              applyTheme(theme.value);
              isOpen = false;
            }}
            class={cn(
              "w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-all text-left focus:outline-none focus:ring-2 focus:ring-ring",
              currentTheme === theme.value
                ? "bg-muted/80 border-primary/30 shadow-sm"
                : "bg-transparent border-transparent hover:bg-muted/45 hover:border-border/70",
            )}
            aria-label={`Set theme to ${theme.label}`}
            title={theme.label}
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class={cn(
                  "h-5 w-5 shrink-0 rounded-full border",
                  theme.color,
                )}
              ></span>
              <span class="min-w-0">
                <span class="block text-sm font-medium leading-none truncate">{theme.label}</span>
                <span class="block mt-1 text-[11px] leading-none text-muted-foreground/95 truncate">
                  {theme.description}
                </span>
              </span>
            </div>

            {#if currentTheme === theme.value}
              <svg
                class="w-4 h-4 text-primary shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m20 6-11 11-5-5"></path>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .theme-switcher-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .theme-switcher-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .theme-switcher-scroll::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, var(--muted-foreground) 28%, transparent);
    border-radius: 999px;
  }

  .theme-switcher-scroll {
    scrollbar-color: color-mix(in oklab, var(--muted-foreground) 28%, transparent) transparent;
    scrollbar-width: thin;
  }
</style>
