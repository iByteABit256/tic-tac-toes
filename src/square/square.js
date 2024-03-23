import styles from "./square.module.css";
import "../styles.css";

export default function Square({ id, value, onSquareClick, isActive }) {
  return (
    <button
      id={id}
      className={isActive ? styles.activeSquare : styles.square}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
