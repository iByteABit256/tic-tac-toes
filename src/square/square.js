import styles from "./square.module.css";
import "../styles.css";

export default function Square({ value, onSquareClick, isActive }) {
  return (
    <button
      className={isActive ? styles.activeSquare : styles.square}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
