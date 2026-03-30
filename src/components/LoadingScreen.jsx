import styles from '../styles/LoadingScreen.module.css';

/**
 * Full-page loading state while cards are being fetched.
 */
export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>Summoning cards…</p>
    </div>
  );
}
