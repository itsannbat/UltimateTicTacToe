import { TicTacToe } from "./TicTacToe";

export class UltimateTicTacToe {
  boards: TicTacToe[][];
  currentBoard: [number, number] | null; // Indicates the currently active board, null if any can be played
  currentPlayer: number;
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

  // You'll need methods here similar to TicTacToe, but at the UTTT level
  // For example, handling clicks not just on a cell, but first determining which board is active
  // and then forwarding the click to the appropriate TicTacToe instance
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
        const moveMade = board.handleCellClick(cellI, cellJ);
        if (moveMade) {
          // After making a move, check if the board has a winner or is tied
          const boardWinState = board.checkWin();
          if (boardWinState !== -1) {
            // Update global win status if necessary
            this.globalWinner = this.checkGlobalWin();
          }

          // Update currentBoard for the next move based on Ultimate Tic Tac Toe rules
          if (this.boards[cellI][cellJ].won === -1) {
            // If the targeted board is still in play
            this.currentBoard = [cellI, cellJ];
          } else {
            this.currentBoard = null; // Allow player to choose any board if the targeted board is finished
          }
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

  resetGame() {
    this.boards.forEach((row) => row.forEach((board) => board.resetGame()));
    this.currentBoard = null;
    this.globalWinner = -1;
  }
}
