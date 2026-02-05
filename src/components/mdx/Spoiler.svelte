<script>
  export let title = "Mostrar respuesta";
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<div class="my-6 border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 not-prose">
  <button
    class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
    on:click={toggle}
  >
    <span class="font-semibold text-gray-700 dark:text-gray-200">{title}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-500 transform transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  {#if isOpen}
    <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
      <slot />
    </div>
  {/if}
</div>
