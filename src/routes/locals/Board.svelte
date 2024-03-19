<script lang="ts">

  let board = [[0, 0, 0],[0, 0, 0],[0, 0, 0]]
  let currentPlayer = 1;
  $: won = checkWin(board);

  // Function to handle cell clicks
  function handleCellClick(i: number, j: number) {
    if (board[i][j] === 0) { // Only update the cell if it's empty
      board[i][j] = currentPlayer;
      currentPlayer = currentPlayer === 1 ? 2 : 1; // Toggle the player
      board = board.slice(); // This triggers reactivity
    }
  }

  function checkWin(board: number[][]) {
    // Check rows for win
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== 0) {
        return board[i][0] === 1 ? 1 : 2;
      }
    }

    // Check columns for win
    for (let j = 0; j < 3; j++) {
      if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[0][j] !== 0) {
        return board[0][j] === 1 ? 1 : 2;
      }
    }

    // Check diagonals for win
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== 0) {
      return board[0][0] === 1 ? 1 : 2; // Top left to bottom right diagonal
    } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== 0) {
      return board[0][2] === 1 ? 1 : 2; // Top right to bottom left diagonal
    }

    let allCellsFilled = true;

    // Check if all cells are filled
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          allCellsFilled = false;
        }
      }
    }
    return allCellsFilled === false ? -1 : 3;
  }
</script>
<div
  class="m-4"
  class:opacity-20={won === 1 || won === 2 || won === 3}
  class:pointer-events-none={won === 1 || won === 2 || won === 3}
  id='container'
>
  {#each board as row, i}
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

<p class="text-center mt-4">
  {#if won === 1}
    X wins!
  {:else if won === 2}
    O wins!
  {:else if won === 3}
    It's a tie!
  {/if}
</p>