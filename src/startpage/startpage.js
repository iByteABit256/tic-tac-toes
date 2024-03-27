import styles from "./startpage.module.css";
import logo from "../media/logo.png";
import { useState } from "react";
import { getRandomInt, getOpponentSymbol } from "../utils";

export default function StartScreen({ onStart }) {
  const [aiModeSelected, setAiModeSelected] = useState(false);
  const aiPropKey = "computerOpponentModeEnabled";
  const playerSymbolKey = "playerSymbol";
  const opponentSymbolKey = "opponentSymbol";
  const difficultyKey = "difficulty";

  function createMultiplayerGame() {
    const props = new Map([[aiPropKey, false]]);
    onStart(props);
  }

  function randomSymbol() {
    return getRandomInt(2) === 0 ? "X" : "O";
  }

  function createAiGame(playerSymbol = randomSymbol(), difficulty = 5) {
    const props = new Map([
      [aiPropKey, true],
      [playerSymbolKey, playerSymbol],
      [opponentSymbolKey, getOpponentSymbol(playerSymbol)],
      [difficultyKey, difficulty],
    ]);
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
            <button onClick={() => createAiGame("X")}>Play as X</button>
            <button onClick={() => createAiGame("O")}>Play as O</button>
            <button onClick={() => createAiGame()}>Random</button>
          </div>
          <button onClick={() => setAiModeSelected(false)}>Back</button>
        </>
      )}
    </div>
  );
}
