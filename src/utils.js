export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export class TotalScores {
  scores;
  gameIsFinished;

  constructor(scores, gameIsFinished) {
    this.scores = scores;
    this.gameIsFinished = gameIsFinished;
  }
}

export function calculateTotalScores(boards) {
  let gamesEnded = 0;
  let scores = 
    new Map([
      ["X", 0],
      ["O", 0],
    ]);

  for (let i = 0; i < 9; i++) {
    const board = boards[i];
    const winner = calculateWinner(board);
    const isDraw = !winner && boardIsFilled(board);

    if (winner) {
      scores.set(winner, scores.get(winner) + 1);
      gamesEnded++;
    }

    if (isDraw) {
      scores = new Map(Array.from(scores, ([key, value]) => [key, value + 1]));
      gamesEnded++;
    }
  }

  return new TotalScores(scores, gamesEnded === 9);
}

export function boardIsFilled(squares) {
  return !squares.some((square) => square === null);
}

export function getUnfinishedBoards(gamesEnded) {
  const unfinishedBoards = new Set();
  for (let i = 0; i < 9; i++) {
    if (!gamesEnded.has(i)) {
      unfinishedBoards.add(i);
    }
  }

  return unfinishedBoards;
}

export function simulateClick(element) {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(clickEvent);
}
