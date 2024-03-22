import styles from "./startpage.module.css";
import logo from "../media/logo.png";

export default function StartScreen({ onStart }) {
  return (
    <div className={styles.startScreen}>
      <h1>Tic Tac Toes</h1>
      <img src={logo} alt="Logo" /> 
      <button onClick={onStart}>Play</button>
    </div>
  );
}