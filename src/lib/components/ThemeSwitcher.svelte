<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "$lib/utils";
  import { Palette } from "lucide-svelte";
  import { slide } from "svelte/transition";

  const themes = [
    { value: "theme-swiss", label: "Swiss", color: "bg-white border-black" },
    { value: "theme-neo", label: "Neo", color: "bg-[#FFFDF0] border-black" },
    {
      value: "theme-cyber",
      label: "Cyber",
      color: "bg-[#0d0514] border-[#00ffff]",
    },
    {
      value: "theme-danqing",
      label: "DanQing",
      color: "bg-[#2d302f] border-[#F9906F]",
    },
    {
      value: "theme-espresso",
      label: "Espresso",
      color: "bg-[#2d2d2d] border-[#f9a959]",
    },
    {
      value: "theme-helios",
      label: "Helios",
      color: "bg-[#1d2021] border-[#eb8413]",
    },
    {
      value: "theme-metal",
      label: "Metal",
      color: "bg-[#000000] border-[#c1c1c1]",
    },
    {
      value: "theme-default",
      label: "Default",
      color: "bg-[#fcfcfc] border-gray-200",
    },
  ];

  let currentTheme = "theme-default";
  let isOpen = false;

  onMount(() => {
    // Check for saved theme (branding) - Key: "design-system"
    const saved = localStorage.getItem("design-system");
    if (saved) {
      currentTheme = saved;
      // We don't call applyTheme here on mount to avoid re-triggering logic unnecessarily
      // but we should ensure the class is present if not handled by head script.
      // Assuming a head script isn't there, we do it:
      applyTheme(saved);
    }
  });

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function applyTheme(theme: string) {
    currentTheme = theme;
    localStorage.setItem("design-system", theme);

    // Remove all existing theme classes but NOT 'dark'
    const body = document.body;
    themes.forEach((t) => body.classList.remove(t.value));

    // Add new theme class
    body.classList.add(theme);

    // Close dropdown on selection (optional)
    // isOpen = false;
  }
</script>

<div class="relative">
  <button
    onclick={toggleOpen}
    class="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
    aria-label="Change Theme"
    aria-expanded={isOpen}
  >
    <Palette class="w-5 h-5" />
  </button>

  {#if isOpen}
    <div
      transition:slide={{ duration: 200, axis: "y" }}
      class="absolute right-0 top-full mt-2 p-2 bg-popover/80 backdrop-blur-md border border-border shadow-lg rounded-full flex gap-2 z-50 origin-top-right min-w-max"
    >
      {#each themes as theme}
        <button
          onclick={() => {
            applyTheme(theme.value);
            isOpen = false;
          }}
          class={cn(
            "relative h-6 w-6 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
            theme.color,
            currentTheme === theme.value
              ? "ring-2 ring-primary scale-110"
              : "opacity-80 hover:opacity-100",
          )}
          aria-label="Set theme to {theme.label}"
          title={theme.label}
        >
          <span class="sr-only">{theme.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
