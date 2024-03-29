import styles from "./startpage.module.css";
import logo from "../media/logo.png";
import { GameStartProperties } from "../app";
import { useState } from "react";
import { getRandomInt, getOpponentSymbol } from "../utils";

export default function StartScreen({ onStart }) {
  const [aiModeSelected, setAiModeSelected] = useState(false);
  const [onlineModeSelected, setOnlineModeSelected] = useState(false);
  const [joinModeSelected, setJoinModeSelected] = useState(false);
  const [joinId, setJoinId] = useState("");

  function createMultiplayerGame() {
    const props = new GameStartProperties(false, null, null, null);
    onStart(props);
  }

  function createOnlineGame() {
    const props = new GameStartProperties(false, "X", "O", null, true);
    onStart(props);
  }

  function joinOnlineGame() {
    const props = new GameStartProperties(false, "O", "X", null, true, joinId);
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

  function createOnlineGame() {
    const props = new GameStartProperties(false, null, null, null, true);
    onStart(props);
  }

  function joinOnlineGame() {
    const props = new GameStartProperties(false, null, null, null, true, joinId);
    onStart(props);
  }

  return (
    <div className={styles.startScreen}>
      <h1>Tic Tac Toes</h1>
      <img src={logo} alt="Logo" />
      {!aiModeSelected && !onlineModeSelected && (
        <>
          <button onClick={() => setOnlineModeSelected(true)}>Play Online</button>
          <button onClick={() => createMultiplayerGame()}>Play</button>
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
      {onlineModeSelected && !joinModeSelected && (
        <>
          <button onClick={() => createOnlineGame()}>Create Game</button>
          <button onClick={() => setJoinModeSelected(true)}>Join Game</button>
          <button onClick={() => setOnlineModeSelected(false)}>Back</button>
        </>
      )}
      {joinModeSelected && (
        <>
          <input
            type="text"
            placeholder="Enter Game ID"
            onChange={(e) => setJoinId(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <button onClick={() => joinOnlineGame()}>Join</button>
          <button onClick={() => setJoinModeSelected(false)}>Back</button>
        </>
      )}
    </div>
  );
}
