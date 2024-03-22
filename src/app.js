import { useState } from "react";
import About from "./about/about";
import ScoreBoard from "./scoreboard/scoreboard";
import Board from "./board/board";
import { getUnfinishedBoards } from "./utils";

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
  const [soundEnabled, setSoundEnabled] = useState(true);

  function onSoundButtonClick() {
    setSoundEnabled(!soundEnabled); 
  }

  // Resets state variables to initial values
  function resetState() {
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
  }

  // Game over logic
  function gameOver() {
    const [scoreA, scoreB] = scores;

    if (scoreA[1] === scoreB[1]) {
      alert("Draw!");
    } else if (scoreA[1] > scoreB[1]) {
      alert(`Player ${scoreA[0]} has won with a score of ${scoreA[1]}!`);
    } else {
      alert(`Player ${scoreB[0]} has won with a score of ${scoreB[1]}!`);
    }

    resetState();
  }

  // Handles a player move
  function handlePlay(boardNum, nextSquares, squareChanged) {
    const nextBoards = boards.slice();
    nextBoards[boardNum] = nextSquares;
    setBoards(nextBoards);
    setTurn(turn + 1);

    const unfinishedBoards = getUnfinishedBoards(gamesEnded);

    // Game has ended
    if (unfinishedBoards.size === 0) {
      gameOver();
      return;
    }

    // If next board has ended, start on any unfinished board
    if (gamesEnded.has(squareChanged)) {
      setActiveBoards(unfinishedBoards);
    } else {
      setActiveBoards(new Set([squareChanged]));
    }
  }

  // Gets called whenever the score needs to be changed
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
            soundEnabled={soundEnabled}
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
      <button
        className={soundEnabled ? "sound-on" : "sound-off"}
        onClick={onSoundButtonClick}
      />
      <a
        href="https://github.com/iByteABit256/tic-tac-toes"
        className="github-link"
      />
      <About />
      <ScoreBoard scores={scores} />
      {gameRows}
    </div>
  );
}
