<script lang="ts">

  import { writable, get } from 'svelte/store';
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

  let strategyX = writable('human'); // Strategy for player X
  let strategyO = writable('human'); // Strategy for player O

  async function aiMakeRandomMove() {
    console.log('Random Bot')
    if (await game.aiMakeRandomMove()) {
      console.log('Moved')
      boards.set(game.boards);
      currentPlayer.set(game.currentPlayer);
      currentBoard.set(game.currentBoard);
      globalWinner.set(game.globalWinner);
    }
  }

  async function aiMinimaxMove() {
    console.log('Minimax Alpha Beta Bot')
    if (await game.aiMinimaxMove()) {
      console.log('Moved')
      boards.set(game.boards);
      currentPlayer.set(game.currentPlayer);
      currentBoard.set(game.currentBoard);
      globalWinner.set(game.globalWinner);
    }
  }

  async function aiSmartMove() {
    console.log('Smart Bot')
    if (await game.aiSmartMove()) {
      console.log('Moved')
      boards.set(game.boards);
      currentPlayer.set(game.currentPlayer);
      currentBoard.set(game.currentBoard);
      globalWinner.set(game.globalWinner);
    }
  }

  function aiMakeMove() {
    if ($globalWinner !== -1) return; // No move if the game is over

    let strategy = $currentPlayer === 1 ? $strategyX : $strategyO;
    switch (strategy) {
      case 'random':
        aiMakeRandomMove();
        break;
      case 'minimax':
        aiMinimaxMove();
        break;
      case 'smart':
        aiSmartMove();
        break;
      case 'human':
        // Do nothing if the strategy is human
        break;
    }
  }

  function onStrategyChange() {
    console.log('Strategy Change:', $strategyX, $strategyO);
    if ($globalWinner === -1) {
      if (($currentPlayer === 1 && $strategyX !== 'human') || ($currentPlayer === 2 && $strategyO !== 'human')) {
        console.log('AI should move now');
        aiMakeMove();
      }
    }
  }

  $: $strategyX, onStrategyChange(); // Reactively call onStrategyChange when strategyX changes
  $: $strategyO, onStrategyChange(); // Reactively call onStrategyChange when strategyO changes

  function updateStrategyX(newStrategy: string) {
    strategyX = newStrategy;
    game.setStrategyX(newStrategy);
  }

  function updateStrategyO(newStrategy: string) {
    strategyO = newStrategy;
    game.setStrategyO(newStrategy);
  }

  function setStrategyX(newStrategy: string) {
    this.strategyX = newStrategy;
    if (this.currentPlayer === 1 && newStrategy !== 'human') {
        this.aiMakeMove();  // Trigger an AI move if it's AI's turn
    }
}

  function setStrategyO(newStrategy: string) {
    this.strategyO = newStrategy;
    if (this.currentPlayer === 2 && newStrategy !== 'human') {
        this.aiMakeMove();  // Trigger an AI move if it's AI's turn
    }
  }


  // async function handleCellClick(boardI: number, boardJ: number, cellI: number, cellJ: number) {
  //   if (await game.handleCellClick(boardI, boardJ, cellI, cellJ)) {
  //     boards.set(game.boards);
  //     currentPlayer.set(game.currentPlayer);
  //     currentBoard.set(game.currentBoard);
  //     globalWinner.set(game.globalWinner);

  //     setTimeout(() => {
  //       aiSmartMove();
  //       boards.set(game.boards);
  //       currentPlayer.set(game.currentPlayer);
  //       currentBoard.set(game.currentBoard);
  //       globalWinner.set(game.globalWinner);
  //     }, 500);
  //   }
  // }

  async function handleCellClick(boardI: number, boardJ: number, cellI: number, cellJ: number) {
    if ($currentPlayer === 1 && $strategyX === 'human' || $currentPlayer === 2 && $strategyO === 'human') {
      if (await game.handleCellClick(boardI, boardJ, cellI, cellJ)) {
        updateGameState();
        checkAndMakeAiMove();
      }
    }
  }

  function checkAndMakeAiMove() {
    // Check if the next player is AI and if so, make a move
    setTimeout(() => {
      if ($globalWinner === -1) {
        aiMakeMove();
      }
    }, 500); // Delay to simulate real time between moves
  }

  function updateGameState() {
    boards.set(game.boards);
    currentPlayer.set(game.currentPlayer);
    currentBoard.set(game.currentBoard);
    globalWinner.set(game.globalWinner);
  }

  function resetGame() {
    game.resetGame(); // Resets the game's internal state
    boards.set(game.boards); // Synchronize the Svelte store with the reset game boards
    currentPlayer.set(1); // Reset the current player in the UI
    currentBoard.set(game.currentBoard); // Reset the current active board
    globalWinner.set(game.globalWinner); // Reset the global winner status
  }

  async function downloadTelemetry() {
    const telemetryData = await game.getTelemetry();
    const blob = new Blob([JSON.stringify(telemetryData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'telemetry.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
</script>
<div class="flex flex-col items-center">
  <div class="mb-4">
    <label class="font-bold mr-2">X:</label>
    <select bind:value={$strategyX} class="border-2 border-black p-1 rounded-md" on:change="{() => updateStrategyX(strategyX)}">
      <option value="random">Random Bot</option>
      <option value="minimax">Minimax Bot</option>
      <option value="smart">Smart Bot</option>
      <option value="human">Human</option>
    </select>
  </div>
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
  <div class="mt-4">
    <label class="font-bold mr-2">O:</label>
    <select bind:value={$strategyO} class="border-2 border-black p-1 rounded-md" on:change="{() => updateStrategyO(strategyO)}">
      <option value="random">Random Bot</option>
      <option value="minimax">Minimax Bot</option>
      <option value="smart">Smart Bot</option>
      <option value="human">Human</option>
    </select>
  </div>
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

  <div class="flex justify-center">
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition-colors" on:click={downloadTelemetry}>
      Download Telemetry
    </button>
  </div>

</div>
