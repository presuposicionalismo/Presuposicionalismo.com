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

<style>
  @import "../styles/global.css";

  a {
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
	padding: var(--size-fluid-1);

    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    border-radius: var(--radius-3);
    place-content: center;
	font-size: var(--font-size-base);
	font-weight: var(--font-bold);
    line-height: 1rem;

    background-color: var(--surface-2);
	color: var(--text-1);
  }
  a:hover {
    background-color: var(--surface-3);
	transform: translate(0, -0.25rem);
  }

  div {
    display: inline-block;
    margin-right: 1rem;
  }

  .active {
    font-weight: bold;
    text-decoration: underline;
  }
</style>
