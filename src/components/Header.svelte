<script lang="ts">
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	let links = [
		{ name: "Inicio", href: "/" },
		{ name: "About", href: "/about" },
		{ name: "Blog", href: "/blog" },
		{ name: "Libros", href: "/libros" }
	];
</script>

<nav class="mobile-nav">
	<div class="container">
		<a href="/" class="logo">MySite</a>
		<button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle Menu">
			<span class="menu-icon">{isOpen ? '✕' : '☰'}</span>
		</button>
	</div>

	<ul class="nav-list {isOpen ? 'open' : ''}">
		{#each links as link}
			<li><a href={link.href} class="nav-link" on:click={() => isOpen = false}>{link.name}</a></li>
		{/each}
	</ul>
</nav>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
	}

	.mobile-nav {
		background-color: #333;
		padding: 1rem;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
	}

	.logo {
		color: white;
		font-size: 1.5rem;
		text-decoration: none;
	}

	.menu-toggle {
		background: none;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: none;
		flex-direction: column;
		position: absolute;
		top: 70px;
		left: 0;
		right: 0;
		background-color: #333;
		border-top: 1px solid #444;
	}

	.nav-list.open {
		display: flex;
	}

	.nav-link {
		color: white;
		text-decoration: none;
		padding: 1rem;
		text-align: center;
		border-bottom: 1px solid #444;
	}

	.nav-link:hover {
		background-color: #444;
	}

	@media (min-width: 768px) {
		.menu-toggle {
			display: none;
		}

		.nav-list {
			display: flex;
			flex-direction: row;
			position: static;
			background-color: transparent;
			border: none;
		}

		.nav-link {
			border: none;
			padding: 0 1rem;
		}

		.nav-link:hover {
			background-color: transparent;
			color: #ddd;
		}
	}
</style>
