import { simulateClick, calculateTotalScores } from "../utils";

// Finds best move with Minmax and returns a [boardIdx, squareIdx] pair
function calculateBestMove(
  boards,
  activeBoards,
  maximizingPlayer,
  depth = 0,
  alpha = -Infinity,
  beta = Infinity,
) {
  const totalScores = calculateTotalScores(boards); 
  const gameIsFinished = totalScores.gameIsFinished;
  const [scoreX, scoreO] = totalScores.scores;
  
  if (gameIsFinished) {
    if (scoreX[1] === scoreO[1]) {
      return 0;
    } else if (scoreX[1] > scoreO[1]) {
      return depth - 100;
    } else {
      return 100 - depth;
    }
  }

  let bestScore = maximizingPlayer ? -Infinity : Infinity;
  let bestMove = null;

  const player = maximizingPlayer ? "O" : "X";

  activeBoards.forEach((boardIdx) => {
    const board = boards[boardIdx];

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoards = [...boards];
        const newBoard = [...board];
        newBoard[i] = player;
        newBoards[boardIdx] = newBoard;
        const score = calculateBestMove(newBoards, activeBoards, !maximizingPlayer, depth + 1, alpha, beta);

        if (maximizingPlayer) {
          if (score > bestScore) {
            bestScore = score;
            bestMove = [boardIdx, i];
          }
          alpha = Math.max(alpha, score);
        } else {
          if (score < bestScore) {
            bestScore = score;
            bestMove = [boardIdx, i];
          }
          beta = Math.min(beta, score);
        }

        if (beta <= alpha) {
          // Alpha-beta pruning
          break;
        }
      }
    }
  });

  if (depth === 0) {
    return bestMove;
  }

  return bestScore;
}

export function makeAIMove(boards, activeBoards) {
  const bestMove = calculateBestMove(boards, activeBoards, true);
  return bestMove;
}

export function simulateAIMove(aiMove) {
  const [boardNum, squareNum] = aiMove;

  const selector = `#board-${boardNum}-square-${squareNum}`;

  // Find the square element corresponding to the given board and square numbers
  const squareElement = document.querySelector(selector);

  // Simulates a click on that square element
  if (squareElement) {
    simulateClick(squareElement);
  } else {
    console.error(`Square element not found for selector: ${selector}`);
  }
}
