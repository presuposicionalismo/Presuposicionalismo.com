<script>
  export let question = "";
  export let options = [];
  export let answer = ""; // indice de la respuesta correcta o el texto de la respuesta correcta

  let selected = null;
  let isCorrect = null;

  function checkAnswer(option, index) {
    selected = index;
    // Si answer es número, comparamos índice. Si es string, comparamos texto.
    if (typeof answer === 'number') {
        isCorrect = index === answer;
    } else {
        isCorrect = option === answer;
    }
  }
</script>

<div class="my-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 not-prose">
  <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{question}</h3>
  <div class="space-y-2">
    {#each options as option, index}
      <button
        class="w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center justify-between
          {selected === index 
            ? (isCorrect ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-100' : 'bg-red-100 border-red-500 text-red-900 dark:bg-red-900/30 dark:text-red-100')
            : 'bg-gray-50 hover:bg-gray-100 border border-transparent dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:text-gray-200'}
          {selected !== null && selected !== index ? 'opacity-50 cursor-not-allowed' : ''}
        "
        on:click={() => selected === null && checkAnswer(option, index)}
        disabled={selected !== null}
      >
        <span>{option}</span>
        
        {#if selected === index}
            {#if isCorrect}
                <span class="text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </span>
            {:else}
                <span class="text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>
            {/if}
        {/if}
      </button>
    {/each}
  </div>
  {#if selected !== null}
    <div class="mt-4 p-3 rounded-md {isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}">
      <p class="font-medium">
        {isCorrect ? '¡Correcto!' : 'Incorrecto. Inténtalo de nuevo en la próxima.'}
      </p>
    </div>
  {/if}
</div>
