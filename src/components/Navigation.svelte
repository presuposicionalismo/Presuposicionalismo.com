<script lang="ts">
  import { onMount } from "svelte";

  let links = [
    { name: "Inicio", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Libros", href: "/libros" },
  ];

  let currentPath = "";

  onMount(() => {
    currentPath = window.location.pathname;
  });
</script>

<nav class="navmenu">
  {#each links as link}
    <div>
      <a
        href={link.href}
        class="nav-link {currentPath === link.href ? 'active' : ''}"
      >
        {link.name}
      </a>
    </div>
  {/each}
</nav>
