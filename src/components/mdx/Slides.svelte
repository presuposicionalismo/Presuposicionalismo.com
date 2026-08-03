<script>
  export let slides = [];
  let currentSlide = 0;

  function nextSlide() {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
    }
  }
</script>

<div
  class="my-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 not-prose shadow-sm"
>
  <div
    class="p-8 min-h-[300px] flex flex-col justify-center items-center text-center"
  >
    <div class="prose dark:prose-invert max-w-none">
      {@html slides[currentSlide]}
    </div>
  </div>

  <div
    class="bg-gray-50 dark:bg-gray-900 p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700"
  >
    <button
      class="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={prevSlide}
      disabled={currentSlide === 0}
    >
      Anterior
    </button>
    <span class="text-sm text-gray-500 dark:text-gray-400">
      {currentSlide + 1} de {slides.length}
    </span>
    <button
      class="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={nextSlide}
      disabled={currentSlide === slides.length - 1}
    >
      Siguiente
    </button>
  </div>
</div>
