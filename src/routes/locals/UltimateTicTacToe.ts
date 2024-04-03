import { TicTacToe } from "./TicTacToe";

export class UltimateTicTacToe {
  boards: TicTacToe[][];
  currentBoard: [number, number] | null; // Indicates the currently active board, null if any can be played
  currentPlayer: 1 | 2;
  globalWinner: number;

  constructor() {
    this.boards = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => new TicTacToe())
      );
    this.currentBoard = null;
    this.currentPlayer = 1;
    this.globalWinner = -1;
  }

  handleCellClick(
    boardI: number,
    boardJ: number,
    cellI: number,
    cellJ: number
  ): boolean {
    if (this.globalWinner !== -1) {
      return false; // Do not handle clicks if the game has ended
    }

    // Check if the click is on the current board or if any board is playable (currentBoard is null)
    if (
      this.currentBoard === null ||
      (this.currentBoard[0] === boardI && this.currentBoard[1] === boardJ)
    ) {
      // Proceed only if the cell is not already filled
      const board = this.boards[boardI][boardJ];
      if (board.board[cellI][cellJ] === 0) {
        // Ensure the cell is empty
        board.currentPlayer = this.currentPlayer;
        const moveMade = board.handleCellClick(cellI, cellJ);
        if (moveMade) {
          // After making a move, check if the board has a winner or is tied
          const boardWinState = board.checkWin(board.board);
          if (boardWinState !== -1) {
            // Update global win status if necessary
            this.globalWinner = this.checkGlobalWin();
          }
          // Update current player for the next move
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

          // Update currentBoard for the next move based on Ultimate Tic Tac Toe rules
          this.currentBoard =
            this.boards[cellI][cellJ].won === -1 ? [cellI, cellJ] : null;
          return true; // Indicate that a move was successfully made
        }
      }
    }
    return false; // Click was not valid or did not result in a move
  }

  checkGlobalWin() {
    // This method will check each TicTacToe instance to see if there's a winner for the entire UTTT game
    // It's similar to checkWin in TicTacToe, but operates on the won status of each board
    const winStates = this.boards.map((row) => row.map((board) => board.won));

    // Check rows for global win
    for (let i = 0; i < 3; i++) {
      if (
        winStates[i][0] === winStates[i][1] &&
        winStates[i][1] === winStates[i][2] &&
        winStates[i][0] > 0
      ) {
        return winStates[i][0];
      }
    }

    // Check columns for global win
    for (let j = 0; j < 3; j++) {
      if (
        winStates[0][j] === winStates[1][j] &&
        winStates[1][j] === winStates[2][j] &&
        winStates[0][j] > 0
      ) {
        return winStates[0][j];
      }
    }

    // Check diagonals for global win
    if (
      winStates[0][0] === winStates[1][1] &&
      winStates[1][1] === winStates[2][2] &&
      winStates[0][0] > 0
    ) {
      return winStates[0][0];
    } else if (
      winStates[0][2] === winStates[1][1] &&
      winStates[1][1] === winStates[2][0] &&
      winStates[0][2] > 0
    ) {
      return winStates[0][2];
    }

    // Check for a global tie
    let allBoardsFinal = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // If a board is still in play (-1), then not all boards are final
        if (winStates[i][j] === -1) {
          allBoardsFinal = false;
        }
      }
    }

    // If all boards are final (either won or tied), but no global winner, it's a tie.
    return allBoardsFinal ? 3 : -1;
  }

  // Method to perform a random move for AI player
  aiMakeRandomMove(): boolean {
    if (this.currentPlayer !== 2 || this.globalWinner !== -1) return false;

    let playableBoards =
      this.currentBoard === null
        ? this.boards.flat()
        : [this.boards[this.currentBoard[0]][this.currentBoard[1]]];

    playableBoards = playableBoards.filter((board) => board.won === -1);

    while (playableBoards.length > 0) {
      const randomBoardIndex = Math.floor(
        Math.random() * playableBoards.length
      );
      const randomBoard = playableBoards[randomBoardIndex];

      const emptySpots = [];
      for (let i = 0; i < randomBoard.board.length; i++) {
        for (let j = 0; j < randomBoard.board[i].length; j++) {
          if (randomBoard.board[i][j] === 0) {
            emptySpots.push({ i, j });
          }
        }
      }

      if (emptySpots.length === 0) {
        playableBoards.splice(randomBoardIndex, 1);
        continue;
      }

      const randomSpotIndex = Math.floor(Math.random() * emptySpots.length);
      const { i, j } = emptySpots[randomSpotIndex];

      // Determine the correct board indexes
      const boardIndexes =
        this.currentBoard === null
          ? {
              boardI: Math.floor(randomBoardIndex / 3),
              boardJ: randomBoardIndex % 3,
            }
          : { boardI: this.currentBoard[0], boardJ: this.currentBoard[1] };

      if (
        this.handleCellClick(boardIndexes.boardI, boardIndexes.boardJ, i, j)
      ) {
        return true;
      }
    }

    return false;
  }

  resetGame() {
    this.boards.forEach((row) => row.forEach((board) => board.resetGame()));
    this.currentBoard = null;
    this.currentPlayer = 1;
    this.globalWinner = -1;
  }
}
