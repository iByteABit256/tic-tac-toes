import {
  simulateClick,
  calculateTotalScores,
  getUnfinishedBoards,
} from "../utils";

// Finds best move with Minimax and returns a [boardIdx, squareIdx] pair
export function calculateBestMove(
  playerSymbol,
  opponentSymbol,
  boards,
  activeBoards,
  maximizingPlayer,
  depth = 0,
  maxDepth = 7,
  alpha = -Infinity,
  beta = Infinity,
) {
  const totalScores = calculateTotalScores(boards);
  const gamesEnded = totalScores.gamesEnded;
  const gameIsFinished = gamesEnded.size === 9;
  const [scoreX, scoreO] = totalScores.scores;

  if (gameIsFinished || depth === maxDepth) {
    const scoreDiff =
      playerSymbol === "X" ? scoreO[1] - scoreX[1] : scoreX[1] - scoreO[1];
    const diffNormalized = scoreDiff * (gameIsFinished ? 10000 : 100);
    if (scoreDiff === 0) {
      return 0;
    } else {
      const depthCoefficient = diffNormalized > 0 ? -depth : depth;
      return diffNormalized + depthCoefficient;
    }
  }

  let bestScore = maximizingPlayer ? -Infinity : Infinity;
  let bestMove = null;

  const player = maximizingPlayer ? opponentSymbol : playerSymbol;

  activeBoards.forEach((boardIdx) => {
    const board = boards[boardIdx];

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoards = [...boards];
        const newBoard = [...board];
        newBoard[i] = player;
        newBoards[boardIdx] = newBoard;

        const unfinishedBoards = getUnfinishedBoards(gamesEnded);

        // If next board has ended, start on any unfinished board
        let newActiveBoards;
        if (gamesEnded.has(i)) {
          newActiveBoards = unfinishedBoards;
        } else {
          newActiveBoards = new Set([i]);
        }

        const score = calculateBestMove(
          playerSymbol,
          opponentSymbol,
          newBoards,
          newActiveBoards,
          !maximizingPlayer,
          depth + 1,
          maxDepth,
          alpha,
          beta,
        );

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

export function makeAIMove(
  playerSymbol,
  opponentSymbol,
  boards,
  activeBoards,
  maxDepth,
) {
  return calculateBestMove(
    playerSymbol,
    opponentSymbol,
    boards,
    activeBoards,
    true,
    0,
    maxDepth,
  );
}

export function simulateMove(move) {
  const [boardNum, squareNum] = move;

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
