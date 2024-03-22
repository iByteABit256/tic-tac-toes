import styles from "./scoreboard.module.css";

export default function ScoreBoard({ scores }) {
  return (
    <div className={styles.scoreBoard}>
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
