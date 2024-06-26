export type spot = 0 | 1 | 2;

export class TicTacToe {
  board: spot[][];
  currentPlayer: 1 | 2;
  won: -1 | 1 | 2 | 3;

  constructor() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.currentPlayer = 1; // 1 for X, 2 for O
    this.won = -1; // -1 for ongoing, 1 for X wins, 2 for O wins, 3 for tie
  }

  // Function to handle cell clicks
  handleCellClick(i: number, j: number): boolean {
    if (this.board[i][j] === 0) {
      // Only update the cell if it's empty
      this.board[i][j] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1; // Toggle the player
      this.won = this.checkWin(this.board);
      return true;
    } else {
      return false;
    }
  }

  simulateMove(cellI: number, cellJ: number): number {
    if (this.board[cellI][cellJ] === 0) {
      this.board[cellI][cellJ] = this.currentPlayer; // Temporarily set the player
      return this.checkWin(this.board); // Check win condition
    }
    return -1; // Return -1 if move is not valid
  }

  checkWin(board: number[][]) {
    // returning properly
    // Check rows for win
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] !== 0
      ) {
        console.log("Row Win");
        console.log(board[i][0] === 1 ? 1 : 2);
        return board[i][0] === 1 ? 1 : 2;
      }
    }

    // Check columns for win
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j] &&
        board[0][j] !== 0
      ) {
        console.log("Column Win");
        console.log(board[0][j] === 1 ? 1 : 2);
        return board[0][j] === 1 ? 1 : 2;
      }
    }

    // Check diagonals for win
    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] !== 0
    ) {
      console.log("Diagonal 1 Win");
      console.log(board[0][0] === 1 ? 1 : 2);
      return board[0][0] === 1 ? 1 : 2; // Top left to bottom right diagonal
    } else if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[0][2] !== 0
    ) {
      console.log("Diagonal 2 Win");
      console.log(board[0][2] === 1 ? 1 : 2);
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

  clone(): TicTacToe {
    const clonedBoard = new TicTacToe();
    clonedBoard.board = this.board.map((row) => [...row]);
    clonedBoard.currentPlayer = this.currentPlayer;
    clonedBoard.won = this.won;
    return clonedBoard;
  }

  resetGame() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.currentPlayer = 1;
    this.won = -1;
  }
}
