import { UltimateTicTacToe } from "./UltimateTicTacToe";

export class AlphaBetaAgent {
  private depth: number;

  constructor(depth: number = 3) {
    this.depth = depth;
  }

  private evaluationFunction(game: UltimateTicTacToe): number {
    return game.evaluationFunction();
  }

  private minimax(
    game: UltimateTicTacToe,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): [number, [number, number, number, number] | null] {
    if (game.globalWinner !== -1 || depth === 0) {
      return [this.evaluationFunction(game), null];
    }

    const moves = game.getPlayableMoves(); // Assume this method provides all playable moves in the format [[boardI, boardJ, cellI, cellJ], ...]

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove: [number, number, number, number] | null = null;

      for (const move of moves) {
        const newGame = game.clone();
        newGame.handleCellClick(move[0], move[1], move[2], move[3]);
        const [evaluationScore] = this.minimax(
          newGame,
          depth - 1,
          alpha,
          beta,
          false
        );
        if (evaluationScore > maxEval) {
          maxEval = evaluationScore;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluationScore);
        if (beta <= alpha) {
          break;
        }
      }

      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      let bestMove: [number, number, number, number] | null = null;

      for (const move of moves) {
        const newGame = game.clone();
        newGame.handleCellClick(move[0], move[1], move[2], move[3]);
        const [evaluationScore] = this.minimax(
          newGame,
          depth - 1,
          alpha,
          beta,
          true
        );
        if (evaluationScore < minEval) {
          minEval = evaluationScore;
          bestMove = move;
        }
        beta = Math.min(beta, evaluationScore);
        if (beta <= alpha) {
          break;
        }
      }

      return [minEval, bestMove];
    }
  }

  public getBestMove(
    game: UltimateTicTacToe
  ): [number, number, number, number] | null {
    const [, bestMove] = this.minimax(
      game,
      this.depth,
      -Infinity,
      Infinity,
      game.currentPlayer === 1
    );
    return bestMove;
  }
}
