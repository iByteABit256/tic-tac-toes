import React, { useState } from "react";
import styles from "./About.module.css";

export default function About() {
  const [active, setActive] = useState(false);

  function toggleActive() {
    setActive(!active);
  }

  return (
    <>
      <button className={styles.about} onClick={toggleActive}>
        ?
      </button>
      {active ? (
        <>
          <div className={styles.overlay}></div>
          <div className={styles.aboutWindow}>
            <div className={styles.aboutWindowContent}>
              <button
                className={styles.closeWindowButton}
                onClick={() => {
                  setActive(false);
                }}
              >
                X
              </button>
              <br />
              Tic Tac Toes is the classic Tic Tac Toe game with a twist. Instead
              of a single 3x3 board, there are 9 boards arranged in a 3x3 grid.
              Players take turns marking spaces in these boards, aiming to win
              individual boards and ultimately achieve the highest total score.
              <br />
              <br />
              The game follows the following rules:
              <br />
              <br />
              <ol>
                <li>Each player plays on one board during their turn.</li>
                <li>
                  The next player must play on the board that matches the
                  position of the square the previous player filled.
                </li>
                <li>
                  If the next board is finished, the player can choose any
                  available board to play on.
                </li>
                <li>
                  Once all boards are finished, the player with the most wins is
                  the total winner, or it's a draw if both players have the same
                  number of wins.
                </li>
                <li>The first move can be played on any board.</li>
              </ol>
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}
