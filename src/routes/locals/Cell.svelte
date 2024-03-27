<script lang="ts">
  import O from "./O.svelte";
  import type { spot } from "./TicTacToe";
  import X from "./X.svelte";

  export let cell: spot | -1 | 3;
</script>
<div class="flex justify-center items-center w-full h-full m-1">
  {#if cell === 1}
    <X/>
  {:else if cell === 2}
    <O/>
  {/if}
</div>