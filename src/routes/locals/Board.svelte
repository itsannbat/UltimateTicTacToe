<script lang="ts">

  import { writable } from 'svelte/store';
  // import { TicTacToe } from './TicTacToe';
  import { UltimateTicTacToe } from './UltimateTicTacToe';
  import X from './X.svelte';
  import O from './O.svelte';
  import Single from './Single.svelte';
  import Cell from './Cell.svelte';

  const game = new UltimateTicTacToe();

  let boards = writable(game.boards);
  let currentPlayer = writable(game.currentPlayer);
  let currentBoard = writable(game.currentBoard);
  let globalWinner = writable(game.globalWinner); // Ensure you have this for the overall game win condition

  function handleCellClick(boardI: number, boardJ: number, cellI: number, cellJ: number) {
    if (game.handleCellClick(boardI, boardJ, cellI, cellJ)) {
      boards.set(game.boards); // Update the boards state
      currentPlayer.set(game.currentPlayer); // Update the current player
      currentBoard.set(game.currentBoard); // Update the current active board
      globalWinner.set(game.globalWinner); // Update the global winner status
    }
  }

  function resetGame() {
    game.resetGame(); // Resets the game's internal state
    boards.set(game.boards); // Synchronize the Svelte store with the reset game boards
    currentPlayer.set(1); // Reset the current player in the UI
    currentBoard.set(game.currentBoard); // Reset the current active board
    globalWinner.set(game.globalWinner); // Reset the global winner status
  }
</script>
<div class="relative">
  {#each $boards as miniBoards, i} <!-- Iterate over each mini-board row -->
    <div class="flex justify-center"> <!-- This will create the rows for mini-boards -->
      {#each miniBoards as miniBoard, j} <!-- Iterate over each mini-board -->
        <div
          class="relative border-2 border-black"
          class:!border-l-0={j === 0}
          class:!border-t-0={i === 0}
          class:!border-r-0={j === 2}
          class:!border-b-0={i === 2}
          style="display: inline-flex; flex-direction: column;"
        >
          <div
            class="z-20 absolute w-full h-full flex items-center justify-center pointer-events-none"
          >
            <Cell cell={miniBoard.won} />
          </div>
          <div
            class="z-10 absolute w-full h-full flex pointer-events-none opacity-60"
            class:bg-gray-200={miniBoard.won !== -1
              || ($currentBoard && (i !== $currentBoard[0] || j !== $currentBoard[1]))
              || game.globalWinner !== -1}
          />
          <Single
            {miniBoard}
            handleCellClick={(cellI, cellJ) => handleCellClick(i, j, cellI, cellJ)}
          />
        </div>
      {/each}
    </div>
  {/each}
  {#if $globalWinner !== -1}
    <p class="font-bold text-4xl text-center absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-4 border-4 border-black">
      {$globalWinner === 1 ? 'X wins!' : $globalWinner === 2 ? 'O wins!' : $globalWinner === 3 ? "It's a tie!" : ''}
    </p>
  {/if}
</div>

<div class='flex flex-row justify-center items-center space-x-16'>
  <div>
    <p class="text-center mt-4 font-bold">
      Current Player:
    </p>
    <div class="flex justify-center">
      <div class="w-10 h-10 flex items-center justify-center">
        {#if $currentPlayer === 1}
          <X/>
        {:else if $currentPlayer === 2}
          <O/>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex justify-center">
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition-colors" on:click={resetGame}>
      Reset Game
    </button>
  </div>
</div>
