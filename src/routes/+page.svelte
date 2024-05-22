<script lang="ts">
  import { onMount } from "svelte";
  import Board from "./locals/Board.svelte";
  import Visualizations from "./locals/Visualizations.svelte";

  let currentPage: 'game' | 'visualizations' = 'game';

  function navigateTo(page: 'game' | 'visualizations') {
    currentPage = page;
  }
</script>

<div class="bg-gray-800 text-white sticky top-0 z-50">
  <nav class="flex justify-center space-x-4 py-4">
    <a class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer" class:font-semibold={currentPage === 'game'} class:bg-gray-900={currentPage === 'game'} on:click={() => navigateTo('game')}>
      Game
    </a>
    <a class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer" class:font-semibold={currentPage === 'visualizations'} class:bg-gray-900={currentPage === 'visualizations'} on:click={() => navigateTo('visualizations')}>
      Visualizations
    </a>
  </nav>
</div>

<div class="flex flex-col justify-center items-center h-screen">
  {#if currentPage === 'game'}
    <Board />
  {:else if currentPage === 'visualizations'}
    <Visualizations />
  {/if}
</div>
