import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ turn, squares, onPlay }) {
  const xIsNext = turn % 2 === 0;

  function nextPlayer() {
    return xIsNext ? "X" : "O";
  }

  const winner = calculateWinner(squares);
  const gameIsTie = !winner && turn === 9;
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    if (gameIsTie) {
      status = "Tie!";
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }
  }

  function handleClick(i) {
    if (squares[i] || winner || gameIsTie) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = nextPlayer();

    onPlay(nextSquares);
  }

  const boardRows = [];

  for (let i = 0; i < 3; i++) {
    const boardRow = [];

    for (let j = 0; j < 3; j++) {
      const square = i * 3 + j;

      boardRow.push(
        <Square
          key={`board-square-${i}-${j}`}
          value={squares[square]}
          onSquareClick={() => handleClick(square)}
        />
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

export default function Game() {
  /*
        TODO: When you play on one position of a board, you have to play on that position of the
              whole game. Create a highlight around the game that is active every turn.
        
              Every game is active during the first turn.

              The player that first reaches 5 won games wins the total game.
    */

  const [turn, setTurn] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[turn];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, turn + 1), nextSquares];
    setHistory(nextHistory);
    setTurn(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setTurn(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;

    if (move === history.length - 1) {
      description = `Current move: ${move}`;
      return <div className="move-counter">{description}</div>;
    } else if (move > 0) {
      description = `Go to move ${move}`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const gameRows = [];

  for (let i = 0; i < 3; i++) {
    const gameRow = [];

    for (let j = 0; j < 3; j++) {
      gameRow.push(
        <div className="game-board">
          <Board
            key={`game-board-${i}-${j}`}
            turn={turn}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
      );
    }
    gameRows.push(
      <div key={`game-column-${i}`} className="game-column">
        {gameRow}
      </div>
    );
  }

  return (
    <div key="Game" className="game">
      {gameRows}
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
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
