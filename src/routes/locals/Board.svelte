<script lang="ts">

  import { writable } from 'svelte/store';
  import { TicTacToe } from './TicTacToe';
  import { UltimateTicTacToe } from './UltimateTicTacToe';

  // const game = new UltimateTicTacToe();

  // let boards = writable(game.boards);
  // let currentPlayer = writable(game.currentPlayer);
  // let currentBoard = writable(game.currentBoard);


  const game = new TicTacToe();

  let board = writable(game.board);
  let currentPlayer = writable(game.currentPlayer);

  function handleCellClick(i: number, j: number) {
    if (game.handleCellClick(i, j)) {
      board.set(game.board); // Update the board state
      currentPlayer.set(game.currentPlayer); // Update the current player
    }
  }

  function resetGame() {
    game.resetGame(); // Resets the game's internal state
    board.set(game.board); // Synchronize the Svelte store with the reset game board
    currentPlayer.set(game.currentPlayer); // Reset the current player in the UI
    // won.set(game.won); // Reset 'won' state in the UI
  }

  // Use a derived store or reactive statement to track the game's win state
  $: won = game.checkWin($board);
</script>
<div
  class="m-4"
  class:opacity-20={won === 1 || won === 2 || won === 3}
  class:pointer-events-none={won === 1 || won === 2 || won === 3}
  id='container'
>
  {#each $board as row, i}
    <div class="flex justify-center"> <!-- flex layout for rows -->
      {#each row as cell, j}
        <button
          class="w-20 h-20 flex items-center justify-center border-2 border-black cursor-pointer"
          class:!border-l-0={j === 0}
          class:!border-t-0={i === 0}
          class:!border-r-0={j === 2}
          class:!border-b-0={i === 2}
          on:click={() => handleCellClick(i, j)}>
          {cell === 0 ? '' : (cell === 1 ? 'x' : 'o')} <!-- Hide 0s, only show if cell value is not 0 -->
        </button>
      {/each}
    </div>
  {/each}
</div>

<div class="flex justify-center">
  <button class="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition-colors" on:click={resetGame}>
    Reset Game
  </button>
</div>

<p class="text-center mt-4">
  {#if won === 1}
    X wins!
  {:else if won === 2}
    O wins!
  {:else if won === 3}
    It's a tie!
  {/if}
</p>