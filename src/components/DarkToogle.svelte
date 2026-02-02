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


