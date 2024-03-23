import { simulateClick } from "../utils";

function calculateBestMove(
  boards,
  activeBoards,
  maximizingPlayer,
  depth = 0,
  alpha = -Infinity,
  beta = Infinity,
) {
  /*
  TODO: This is very far from finished

  const winner = calculateWinner(board);

  if (winner !== null) {
    // If the game is over, return the evaluation score
    return winner === "O" ? 10 - depth : depth - 10;
  }

  if (boardIsFilled(board)) {
    // If the game is a draw, return neutral score
    return 0;
  }

  let bestScore = maximizingPlayer ? -Infinity : Infinity;
  let bestMove = null;

  const player = maximizingPlayer ? "O" : "X";

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = player;
      const score = calculateBestMove(newBoard, !maximizingPlayer, depth + 1, alpha, beta);

      if (maximizingPlayer) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) {
        // Alpha-beta pruning
        break;
      }
    }
  }

  if (depth === 0) {
    return bestMove;
  }

  return bestScore;
  */
  const firstAvailableBoardIdx = activeBoards.values().next().value;
  const firstAvailableBoard = boards[firstAvailableBoardIdx];
  const firstAvailableSquare = firstAvailableBoard.indexOf(null);
  return [firstAvailableBoardIdx, firstAvailableSquare];
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
