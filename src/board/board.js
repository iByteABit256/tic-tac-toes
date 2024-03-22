import { useState } from "react";
import Square from "../square/square";
import styles from "./board.module.css";
import { calculateWinner, boardIsFilled } from "../utils";
import clickSound from "../media/click-sound.mp3";

export default function Board({
  boardNum,
  turn,
  squares,
  onPlay,
  isActive,
  onScoreChange,
  soundEnabled,
}) {
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const playSound = () => new Audio(clickSound).play();

  // If game has restarted, reset state variables
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

    // Update board with new move
    const nextSquares = squares.slice();
    nextSquares[i] = nextPlayer();

    if (soundEnabled) {
      playSound();
    }

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
    boardRows.push(<div className={styles.boardRow}>{boardRow}</div>);
  }

  return (
    <>
      <div className={styles.status}>{status}</div>
      {boardRows}
    </>
  );
}
