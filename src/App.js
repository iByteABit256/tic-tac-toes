import { useState } from "react";
import About from './About/About.js';

function Square({ value, onSquareClick, isActive }) {
  return (
    <button
      className={isActive ? "active-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ boardNum, turn, squares, onPlay, isActive, onScoreChange }) {
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // If game has restarted, reset state
  if (turn === 0 && (winner || isDraw)) {
    setWinner(null);
    setIsDraw(false);
  }

  const xIsNext = turn % 2 === 0;

  function nextPlayer() {
    return xIsNext ? "X" : "O";
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Tie!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i) {
    // Can't play on board if game is ended, square is filled or board is inactive
    if (squares[i] || winner || isDraw || !isActive) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = nextPlayer();

    const nextWinner = calculateWinner(nextSquares);
    const nextDraw = !nextWinner && boardIsFilled(nextSquares);

    if (nextWinner) {
      setWinner(nextWinner);
      onScoreChange(boardNum, [nextWinner]);
    }

    if (nextDraw) {
      setIsDraw(true);
      onScoreChange(boardNum, ["X", "O"]);
    }

    onPlay(boardNum, nextSquares, i);
  }

  const boardRows = [];

  for (let i = 0; i < 3; i++) {
    const boardRow = [];

    for (let j = 0; j < 3; j++) {
      const square = i * 3 + j;

      boardRow.push(
        <Square
          key={`board-${boardNum}-square-${i}-${j}`}
          value={squares[square]}
          onSquareClick={() => handleClick(square)}
          isActive={isActive}
        />,
      );
    }
    boardRows.push(<div className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function ScoreBoard({ scores }) {
  return (
    <div className="score-board">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(scores).map(([player, score]) => (
            <tr key={player}>
              <td>{player}</td>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Game() {
  const [turn, setTurn] = useState(0);
  const [boards, setBoards] = useState(Array(9).fill(Array(9).fill(null)));
  const [activeBoards, setActiveBoards] = useState(
    new Set([...Array(9).keys()]),
  );
  const [gamesEnded, setGamesEnded] = useState(new Set());
  const [scores, setScores] = useState(
    new Map([
      ["X", 0],
      ["O", 0],
    ]),
  );

  function handlePlay(boardNum, nextSquares, squareChanged) {
    const nextBoards = boards.slice();
    nextBoards[boardNum] = nextSquares;
    setBoards(nextBoards);
    setTurn(turn + 1);

    const unfinishedBoards = new Set();
    for (let i = 0; i < 9; i++) {
      if (!gamesEnded.has(i)) {
        unfinishedBoards.add(i);
      }
    }

    // Game has ended
    if (unfinishedBoards.size === 0) {
      const [scoreA, scoreB] = scores;

      if (scoreA[1] === scoreB[1]) {
        alert("Draw!");
      } else if (scoreA[1] > scoreB[1]) {
        alert(`Player ${scoreA[0]} has won with a score of ${scoreA[1]}!`);
      } else {
        alert(`Player ${scoreB[0]} has won with a score of ${scoreB[1]}!`);
      }

      setTurn(0);
      setBoards(Array(9).fill(Array(9).fill(null)));
      setActiveBoards(new Set([...Array(9).keys()]));
      setGamesEnded(new Set());
      setScores(
        new Map([
          ["X", 0],
          ["O", 0],
        ]),
      );

      return;
    }

    // If next board has ended, start on any unfinished board
    if (gamesEnded.has(squareChanged)) {
      setActiveBoards(unfinishedBoards);
    } else {
      setActiveBoards(new Set([squareChanged]));
    }
  }

  function handleScoreChange(boardIdx, changes) {
    changes.forEach((player) => {
      scores.set(player, scores.get(player) + 1);
    });
    setScores(scores);

    gamesEnded.add(boardIdx);
    setGamesEnded(gamesEnded);
  }

  const gameRows = [];

  for (let i = 0; i < 3; i++) {
    const gameRow = [];

    for (let j = 0; j < 3; j++) {
      const boardIdx = i * 3 + j;

      gameRow.push(
        <div className="game-board">
          <Board
            key={`game-board-${i}-${j}`}
            turn={turn}
            boardNum={boardIdx}
            squares={boards[boardIdx]}
            onPlay={handlePlay}
            isActive={activeBoards.has(boardIdx)}
            onScoreChange={handleScoreChange}
          />
        </div>,
      );
    }
    gameRows.push(
      <div key={`game-row-${i}`} className="game-row">
        {gameRow}
      </div>,
    );
  }

  return (
    <div key="Game" className="game">
      <a href="https://github.com/iByteABit256/tic-tac-toes" className="github-link">GitHub</a>
      <About/>
      <ScoreBoard scores={scores} />
      {gameRows}
    </div>
  );
}

function calculateWinner(squares) {
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

function boardIsFilled(squares) {
  return !squares.some((square) => square === null);
}
