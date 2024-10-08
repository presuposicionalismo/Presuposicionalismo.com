<script lang="ts">
	let isOpen = false;

	function toggleDrawer() {
		isOpen = !isOpen;
	}

	let links = [
		{ name: "Home", href: "/" },
		{ name: "About", href: "/about" },
		{ name: "Blog", href: "/blog" },
		{ name: "Contact", href: "/contact" }
	];
</script>

<div class="drawer-container">
	<button class="drawer-toggle" on:click={toggleDrawer} aria-label="Open Menu">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
	</button>

	<div class="drawer-backdrop {isOpen ? 'open' : ''}" on:click={toggleDrawer}></div>

	<div class="drawer {isOpen ? 'open' : ''}">
		<button class="drawer-close" on:click={toggleDrawer} aria-label="Close Menu">✕</button>
		<ul class="drawer-links">
			{#each links as link}
				<li><a href={link.href} class="drawer-link" on:click={toggleDrawer}>{link.name}</a></li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.drawer-container {
		position: relative;
	}

	.drawer-toggle {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
	}

	.drawer {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100%;
		background-color: #333;
		transform: translateX(-100%);
		transition: transform 0.3s ease-in-out;
		z-index: 1000;
		padding: 1rem;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
	}

	.drawer.open {
		transform: translateX(0);
	}

	.drawer-close {
		background: none;
		border: none;
		color: white;
		font-size: 2rem;
		position: absolute;
		top: 1rem;
		right: 1rem;
		cursor: pointer;
	}

	.drawer-links {
		list-style: none;
		padding: 0;
		margin-top: 4rem;
	}

	.drawer-link {
		display: block;
		padding: 1rem;
		color: white;
		text-decoration: none;
		font-size: 1.25rem;
		border-bottom: 1px solid #444;
	}

	.drawer-link:hover {
		background-color: #444;
	}

	.drawer-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease-in-out;
		z-index: 500;
	}

	.drawer-backdrop.open {
		opacity: 1;
		pointer-events: all;
	}

	@media (min-width: 768px) {
		.drawer {
			display: none;
		}
	}
</style>
