import styles from '../styles/GameStats.module.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Displays turns, matched pairs, and elapsed time.
 */
export default function GameStats({ turns, matchedPairs, totalPairs, elapsedTime }) {
  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <span className={styles.value}>{turns}</span>
        <span className={styles.label}>Turns</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{matchedPairs}/{totalPairs}</span>
        <span className={styles.label}>Pairs</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{formatTime(elapsedTime)}</span>
        <span className={styles.label}>Time</span>
      </div>
    </div>
  );
}
