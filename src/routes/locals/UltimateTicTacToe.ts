import { TicTacToe } from "./TicTacToe";
import { AlphaBetaAgent } from "./AlphaBetaAgent";
import { set, get } from "idb-keyval";

export class UltimateTicTacToe {
  boards: TicTacToe[][];
  currentBoard: [number, number] | null; // Indicates the currently active board, null if any can be played
  currentPlayer: 1 | 2; // 1 for X, 2 for O
  globalWinner: number;
  alphaBetaAgent: AlphaBetaAgent;
  turnCounter: number;
  strategyX: string; // Strategy for player X
  strategyO: string; // Strategy for player O

  constructor(strategyX = "human", strategyO = "human") {
    this.boards = Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => new TicTacToe())
      );
    this.turnCounter = 0;
    this.currentBoard = null;
    this.currentPlayer = 1;
    this.globalWinner = -1;
    this.alphaBetaAgent = new AlphaBetaAgent(3);
    this.strategyX = strategyX;
    this.strategyO = strategyO;
  }

  async handleCellClick(
    boardI: number,
    boardJ: number,
    cellI: number,
    cellJ: number
  ): Promise<boolean> {
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
      if (board.won === -1 && board.board[cellI][cellJ] === 0) {
        // Ensure the cell is empty
        board.currentPlayer = this.currentPlayer;
        const moveMade = board.handleCellClick(cellI, cellJ);
        if (moveMade) {
          // After making a move, check if the board has a winner or is tied
          this.turnCounter++;
          const boardWinState = board.checkWin(board.board);
          const [largerBoardNotation, cellNotation] = this.printBoardNotation(
            boardI,
            boardJ,
            cellI,
            cellJ
          );
          const bot =
            this.currentPlayer === 1 ? this.strategyX : this.strategyO;
          if (boardWinState !== -1) {
            // Update global win status if necessary
            await this.logTelemetry({
              eventType: "completedSmallerBoard",
              details: {
                largerBoardNotation,
                cellNotation,
                currentPlayer: this.currentPlayer,
                bot: bot,
              },
              timestamp: new Date().toISOString(),
            });
            this.globalWinner = await this.checkGlobalWin(
              boardI,
              boardJ,
              cellI,
              cellJ
            );
          }
          // Update current player for the next move
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
          // <- uncomment based on humans playing
          await this.logTelemetry({
            eventType: "move",
            details: {
              largerBoardNotation,
              cellNotation,
              currentPlayer: this.currentPlayer,
              bot: bot,
            },
            timestamp: new Date().toISOString(),
          });
          // Update currentBoard for the next move based on Ultimate Tic Tac Toe rules
          this.currentBoard =
            this.boards[cellI][cellJ].won === -1 ? [cellI, cellJ] : null;
          return true; // Indicate that a move was successfully made
        }
      }
    } else {
      console.log(`Move attempted on inactive or completed board.`);
    }
    return false; // Click was not valid or did not result in a move
  }

  async simulateMove(
    boardI: number,
    boardJ: number,
    cellI: number,
    cellJ: number
  ): Promise<boolean> {
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
        const moveMade = board.simulateMove(cellI, cellJ);
        if (moveMade) {
          // After making a move, check if the board has a winner or is tied
          this.turnCounter++;
          const boardWinState = board.checkWin(board.board);
          if (boardWinState !== -1) {
            // Update global win status if necessary
            this.globalWinner = await this.checkGlobalWin(
              boardI,
              boardJ,
              cellI,
              cellJ
            );
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

  async checkGlobalWin(
    boardI: number,
    boardJ: number,
    cellI: number,
    cellJ: number
  ) {
    // This method will check each TicTacToe instance to see if there's a winner for the entire UTTT game
    // It's similar to checkWin in TicTacToe, but operates on the won status of each board
    const winStates = this.boards.map((row) => row.map((board) => board.won));
    const [largerBoardNotation, cellNotation] = this.printBoardNotation(
      boardI,
      boardJ,
      cellI,
      cellJ
    );

    // Check rows for global win
    for (let i = 0; i < 3; i++) {
      if (
        winStates[i][0] === winStates[i][1] &&
        winStates[i][1] === winStates[i][2] &&
        winStates[i][0] > 0
      ) {
        await this.logTelemetry({
          eventType: "completedLargBoard",
          details: {
            largerBoardNotation,
            cellNotation,
            currentPlayer: this.currentPlayer,
          },
          timestamp: new Date().toISOString(),
        });
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
        await this.logTelemetry({
          eventType: "completedLargBoard",
          details: {
            largerBoardNotation,
            cellNotation,
            currentPlayer: this.currentPlayer,
          },
          timestamp: new Date().toISOString(),
        });
        return winStates[0][j];
      }
    }

    // Check diagonals for global win
    if (
      winStates[0][0] === winStates[1][1] &&
      winStates[1][1] === winStates[2][2] &&
      winStates[0][0] > 0
    ) {
      await this.logTelemetry({
        eventType: "completedLargBoard",
        details: {
          largerBoardNotation,
          cellNotation,
          currentPlayer: this.currentPlayer,
        },
        timestamp: new Date().toISOString(),
      });
      return winStates[0][0];
    } else if (
      winStates[0][2] === winStates[1][1] &&
      winStates[1][1] === winStates[2][0] &&
      winStates[0][2] > 0
    ) {
      await this.logTelemetry({
        eventType: "completedLargBoard",
        details: {
          largerBoardNotation,
          cellNotation,
          currentPlayer: this.currentPlayer,
        },
        timestamp: new Date().toISOString(),
      });
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

  async aiMinimaxMove(): Promise<boolean> {
    if (
      (this.currentPlayer === 1 && this.strategyX !== "minimax") ||
      (this.currentPlayer === 2 && this.strategyO !== "minimax") ||
      this.globalWinner !== -1
    ) {
      return false;
    }

    const playableMoves = this.getPlayableMoves();
    if (playableMoves.length === 0) {
      console.log("No moves available");
      return false;
    }

    const bestMove = this.alphaBetaAgent.getBestMove(this);
    if (bestMove) {
      const [boardI, boardJ, cellI, cellJ] = bestMove;
      const moveMade = await this.handleCellClick(boardI, boardJ, cellI, cellJ);
      if (moveMade) {
        // Move was successful, now print the final board notation
        this.printBoardNotation(boardI, boardJ, cellI, cellJ);
        return true;
      }
    }

    return false;
  }

  async aiSmartMove(): Promise<boolean> {
    if (
      (this.currentPlayer === 1 && this.strategyX !== "smart") ||
      (this.currentPlayer === 2 && this.strategyO !== "smart") ||
      this.globalWinner !== -1
    ) {
      return false;
    }

    const playableMoves = this.getPlayableMoves();
    if (playableMoves.length === 0) {
      console.log("No moves available");
      return false;
    }

    for (const [boardI, boardJ, cellI, cellJ] of playableMoves) {
      const board = this.boards[boardI][boardJ];
      if (board.board[cellI][cellJ] === 0) {
        const clonedBoard = board.clone();
        clonedBoard.board[cellI][cellJ] = this.currentPlayer;

        if (clonedBoard.checkWin(clonedBoard.board) === this.currentPlayer) {
          return this.handleCellClick(boardI, boardJ, cellI, cellJ);
        }
      }
    }

    const randomMoveIndex = Math.floor(Math.random() * playableMoves.length);
    const [boardI, boardJ, cellI, cellJ] = playableMoves[randomMoveIndex];

    return this.handleCellClick(boardI, boardJ, cellI, cellJ);
  }

  // Method to perform a random move for AI player
  async aiMakeRandomMove(): Promise<boolean> {
    if (
      (this.currentPlayer === 1 && this.strategyX !== "random") ||
      (this.currentPlayer === 2 && this.strategyO !== "random") ||
      this.globalWinner !== -1
    ) {
      return false;
    }

    const playableMoves = this.getPlayableMoves();
    if (playableMoves.length === 0) {
      console.log("No moves available");
      return false;
    }

    const randomMoveIndex = Math.floor(Math.random() * playableMoves.length);
    const [boardI, boardJ, cellI, cellJ] = playableMoves[randomMoveIndex];

    return this.handleCellClick(boardI, boardJ, cellI, cellJ);
  }

  evaluationFunction(): number {
    let score = 0;
    this.boards.forEach((row) => {
      row.forEach((board) => {
        if (board.won === 2) score++; // AI has won the board
        if (board.won === 1) score--; // Human has won the board
      });
    });
    return score;
  }

  clone(): UltimateTicTacToe {
    const clonedGame = new UltimateTicTacToe();
    for (let i = 0; i < this.boards.length; i++) {
      for (let j = 0; j < this.boards[i].length; j++) {
        clonedGame.boards[i][j] = this.boards[i][j].clone();
      }
    }
    clonedGame.currentBoard = this.currentBoard;
    clonedGame.currentPlayer = this.currentPlayer;
    clonedGame.globalWinner = this.globalWinner;
    return clonedGame;
  }

  getPlayableBoards(): [number, number][] {
    if (
      this.currentBoard &&
      this.boards[this.currentBoard[0]][this.currentBoard[1]].won === -1
    ) {
      return [this.currentBoard]; // If there's a specific board to be played on and it's not already won
    } else {
      // Get indices of all boards that haven't been won yet
      return this.boards.flatMap((row, i) =>
        row
          .filter((board, j) => board.won === -1)
          .map((_, j) => [i, j] as [number, number])
      );
    }
  }

  getPlayableMoves(): [number, number, number, number][] {
    let playableMoves: [number, number, number, number][] = [];

    // Determine playable boards based on the current game state
    const playableBoards = this.getPlayableBoards();

    // For each playable board, find all empty cells (where a move can be made)
    playableBoards.forEach(([boardI, boardJ]) => {
      const board = this.boards[boardI][boardJ];
      if (board.won === -1) {
        for (let cellI = 0; cellI < board.board.length; cellI++) {
          for (let cellJ = 0; cellJ < board.board[cellI].length; cellJ++) {
            if (board.board[cellI][cellJ] === 0) {
              // 0 indicates an empty cell
              playableMoves.push([boardI, boardJ, cellI, cellJ]);
            }
          }
        }
      }
    });

    // If no moves are found and there are still available moves on the board, check all boards
    if (playableMoves.length === 0) {
      for (let i = 0; i < this.boards.length; i++) {
        for (let j = 0; j < this.boards[i].length; j++) {
          const board = this.boards[i][j];
          if (board.won === -1) {
            for (let cellI = 0; cellI < board.board.length; cellI++) {
              for (let cellJ = 0; cellJ < board.board[cellI].length; cellJ++) {
                if (board.board[cellI][cellJ] === 0) {
                  playableMoves.push([i, j, cellI, cellJ]);
                }
              }
            }
          }
        }
      }
    }

    return playableMoves;
  }

  async logTelemetry(data: any) {
    // Retrieve the current telemetry data
    const currentTelemetry = (await get("telemetry")) || [];
    // Append the new data
    currentTelemetry.push(data);
    // Save the updated telemetry data back to IndexedDB
    await set("telemetry", currentTelemetry);
  }

  // This method is used to retrieve the telemetry data
  getTelemetry() {
    // Retrieve and return the telemetry data from IndexedDB
    return get("telemetry");
  }

  printBoardNotation(
    boardI: number,
    boardJ: number,
    cellI: number,
    cellJ: number
  ) {
    // Calculate the larger board's notation which is a number from 1 to 9
    const largerBoardNotation = boardI * 3 + boardJ + 1;
    // Calculate the cell's notation within the larger board, which is also a number from 1 to 9
    const cellNotation = cellI * 3 + cellJ + 1;
    console.log(
      `Move made on Larger board: ${largerBoardNotation}, Cell: ${cellNotation}`
    );
    return [largerBoardNotation, cellNotation];
  }

  resetGame() {
    this.boards.forEach((row) => row.forEach((board) => board.resetGame()));
    this.currentBoard = null;
    this.currentPlayer = 1;
    this.globalWinner = -1;
    this.turnCounter = 0;
  }
}
