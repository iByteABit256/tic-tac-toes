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
  const [selectedDifficulty, setSelectedDifficulty] = useState(6);

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

  function createAiGame(playerSymbol, difficulty) {
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
      {!aiModeSelected && !onlineModeSelected && (
        <>
          <button onClick={() => createMultiplayerGame()}>Play</button>
          <button onClick={() => setOnlineModeSelected(true)}>
            Play Online
          </button>
          <button onClick={() => setAiModeSelected(true)}>
            Play with Computer
          </button>
        </>
      )}
      {aiModeSelected && (
        <>
          <div className={styles.horizontalButtonsContainer}>
            <button onClick={() => createAiGame("X", selectedDifficulty)}>Play first (X)</button>
            <button onClick={() => createAiGame("O", selectedDifficulty)}>Play second (O)</button>
            <button onClick={() => createAiGame(randomSymbol(), selectedDifficulty)}>Random</button>
          </div>
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(parseInt(e.target.value))}
            >
              <option value={6}>Easy</option>
              <option value={7}>Medium</option>
              <option value={8}>Hard</option>
            </select>
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
            placeholder="Enter Opponent's ID"
            onChange={(e) => setJoinId(e.target.value.trim())}
            style={{ marginBottom: "10px" }}
          />
          <button onClick={() => joinOnlineGame()}>Join</button>
          <button onClick={() => setJoinModeSelected(false)}>Back</button>
        </>
      )}
    </div>
  );
}
