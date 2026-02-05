<script>
  export let text = "";
  export let tip = "";
</script>

<span class="relative inline-block group">
  <span class="border-b-2 border-dotted border-gray-400 cursor-help"
    >{text}</span
  >
  <span
    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none"
  >
    {tip}
    <svg
      class="absolute text-gray-900 h-2 w-full left-0 top-full"
      x="0px"
      y="0px"
      viewBox="0 0 255 255"
      xml:space="preserve"
      ><polygon class="fill-current" points="0,0 127.5,127.5 255,0" /></svg
    >
  </span>
</span>
