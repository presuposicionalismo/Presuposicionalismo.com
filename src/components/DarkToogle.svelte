<script lang="ts">
  import { onMount } from 'svelte';

  let themeValue = 'light';

  // Obtener el tema preferido del usuario
  function getPreferTheme() {
    const currentTheme = localStorage.getItem('theme');
    const primaryColorScheme = ''; // "light" | "dark"

    if (currentTheme) return currentTheme;
    if (primaryColorScheme) return primaryColorScheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Establecer el tema y reflejarlo en el DOM
  function setPreference() {
    localStorage.setItem("theme", themeValue);
    reflectPreference();
  }

  function reflectPreference() {
    document.firstElementChild.setAttribute("data-theme", themeValue);
    const themeBtn = document.querySelector("#theme-btn");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", themeValue);
    }

    const body = document.body;
    if (body) {
      const computedStyles = window.getComputedStyle(body);
      const bgColor = computedStyles.backgroundColor;
      const metaThemeColor = document.querySelector("meta[name='theme-color']");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", bgColor);
      }
    }
  }

  // Sincronizar con el esquema del sistema
  function syncWithSystem() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches: isDark }) => {
      themeValue = isDark ? "dark" : "light";
      setPreference();
    });
  }

  // Ejecutar en montaje
  onMount(() => {
    themeValue = getPreferTheme();
    reflectPreference();

    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      setPreference();
    });

    syncWithSystem();
  });
</script>

<button
  id="theme-btn"
  class="theme-toggle"
  title="Toggles light & dark"
  aria-label="auto"
  aria-live="polite"
>
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
    <mask id="moon">
      <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
      <circle cx="40" cy="8" r="11" fill="black"></circle>
    </mask>
    <circle id="sun" cx="12" cy="12" r="11" mask="url(#moon)"></circle>
    <g id="sun-beams">
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </g>
  </svg>
</button>

<style>
  .theme-toggle {
    background: none;
    --nav-icon: var(--text-2);
    --nav-icon-hover: var(--brand);
    border-radius: var(--radius-2);
    min-width: 24px;
    min-height: 24px;
    padding: 6px;
  }

  #moon,
  #sun {
    fill: var(--nav-icon);
    stroke: none;
  }

  #sun {
    transition: transform 0.5s var(--ease-4);
    transform-origin: center center;
  }

  #sun-beams {
    --_opacity-dur: 0.15s;
    stroke: var(--nav-icon);
    stroke-width: 2px;
    transform-origin: center center;
    transition:
      transform 0.5s var(--ease-elastic-4),
      opacity var(--_opacity-dur) var(--ease-3);
  }

  #moon > circle {
    transition: transform 0.5s var(--ease-out-3);
  }

  [data-theme="light"] #sun {
    transform: scale(0.5);
  }

  [data-theme="light"] #sun-beams {
    transform: rotateZ(0.25turn);
    --_opacity-dur: 0.5s;
  }

  [data-theme="dark"] #moon > circle {
    transform: translateX(-20px);
  }

  [data-theme="dark"] #sun-beams {
    opacity: 0;
  }
</style>
