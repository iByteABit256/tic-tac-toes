import styles from "./startpage.module.css";
import logo from "../media/logo.png";
import { GameStartProperties } from "../app";
import { useState } from "react";
import { getRandomInt, getOpponentSymbol } from "../utils";

export default function StartScreen({ onStart }) {
  const [aiModeSelected, setAiModeSelected] = useState(false);

  function createMultiplayerGame() {
    const props = new GameStartProperties(false, null, null, null);
    onStart(props);
  }

  function randomSymbol() {
    const randomPlayer = getRandomInt(2);
    return randomPlayer === 0 ? "X" : "O";
  }

  function createAiGame(playerSymbol = randomSymbol(), difficulty = 5) {
    const props = new GameStartProperties(
      true,
      playerSymbol,
      getOpponentSymbol(playerSymbol),
      difficulty,
    );
    onStart(props);
  }

  return (
    <div className={styles.startScreen}>
      <h1>Tic Tac Toes</h1>
      <img src={logo} alt="Logo" />
      {!aiModeSelected && (
        <>
          <button onClick={createMultiplayerGame}>Play</button>
          <button onClick={() => setAiModeSelected(true)}>
            Play with Computer
          </button>
        </>
      )}
      {aiModeSelected && (
        <>
          <div className={styles.horizontalButtonsContainer}>
            <button onClick={() => createAiGame("X")}>Play first (X)</button>
            <button onClick={() => createAiGame("O")}>Play second (O)</button>
            <button onClick={() => createAiGame()}>Random</button>
          </div>
          <button onClick={() => setAiModeSelected(false)}>Back</button>
        </>
      )}
    </div>
  );
}
