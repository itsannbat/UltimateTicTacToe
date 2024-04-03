<script lang="ts">
  import Cell from "./Cell.svelte";
  import O from "./O.svelte";
  import type { TicTacToe } from "./TicTacToe";
  import X from "./X.svelte";

  export let miniBoard: TicTacToe;
  export let handleCellClick: (cellI: number, cellJ: number) => void;
</script>
<div
  id='boardContainer'
  class='m-2'
  class:opacity-50={miniBoard.won !== -1}
  class:pointer-events-none={miniBoard.won !== -1}
>
  {#each miniBoard.board as row, cellI} <!-- Iterate over each row in the mini-board -->
    <div style="display: flex;"> <!-- This will create rows inside each mini-board -->
      {#each row as cell, cellJ} <!-- Iterate over each cell in the row -->
        <button
          on:click={() => handleCellClick(cellI, cellJ)}
          class="w-10 h-10 flex items-center justify-center border-2 border-black cursor-pointer"
          class:!border-l-0={cellJ === 0}
          class:!border-t-0={cellI === 0}
          class:!border-r-0={cellJ === 2}
          class:!border-b-0={cellI === 2}
        >
          <Cell {cell} />
        </button>
      {/each}
    </div>
  {/each}
</div>