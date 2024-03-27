import React from "react";
import styles from "./endgame.module.css";

function isDraw(scores) {
  return scores.get("X") === scores.get("O");
}

function getWinner(scores) {
  const [scoreX, scoreO] = scores;

  if (scoreX[1] > scoreO[1]) {
    return ["X", "O"];
  } else {
    return ["O", "X"];
  }
}

export default function EndScreen({ scores, onRestart }) {
  let winner, loser;
  if (!isDraw(scores)) {
    [winner, loser] = getWinner(scores);
  }

  return (
    <div className={styles.endScreen}>
      <h1>Game Over!</h1>
      <h2>
        Final Score: {scores.get("X")} - {scores.get("O")}
      </h2>
      {isDraw(scores) && (
        <>
          <p>Draw!</p>
        </>
      )}
      {!isDraw(scores) && (
        <>
          <p>
            Winner: <span className={styles.winnerHighlight}>{winner}</span>
          </p>
          <p>
            Loser: <span className={styles.loserHighlight}>{loser}</span>
          </p>
        </>
      )}
      <button onClick={onRestart} className={styles.restartButton}>
        Return to Start Menu
      </button>
    </div>
  );
}
