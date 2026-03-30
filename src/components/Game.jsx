import { useState, useEffect, useRef } from 'react';
import { useYuGiOhCards } from '../hooks/useYuGiOhCards';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSoundEffects } from '../hooks/useSoundEffects';
import GameBoard from './GameBoard';
import GameStats from './GameStats';
import WinScreen from './WinScreen';
import LoadingScreen from './LoadingScreen';
import styles from '../styles/Game.module.css';

// Simple hook to persist state in localStorage
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function setWithStorage(newVal) {
    setState(newVal);
    try {
      localStorage.setItem(key, JSON.stringify(newVal));
    } catch { /* ignore */ }
  }

  return [state, setWithStorage];
}

const DIFFICULTY = {
  easy:   { label: 'Easy',   pairs: 6,  columns: 3 },
  medium: { label: 'Medium', pairs: 8,  columns: 4 },
  hard:   { label: 'Hard',   pairs: 12, columns: 6 },
};

/**
 * Root game component — orchestrates API fetching, game state, and sounds.
 */
export default function Game() {
  const [difficulty, setDifficulty] = useLocalStorageState('ygo-difficulty', 'medium');
  const { cards, loading, usingFallback, fetchCards } = useYuGiOhCards();
  const { deck, flipped, matched, turns, lastResult, gameWon, elapsedTime, handleCardClick, resetGame } =
    useGameLogic(cards);
  const { playFlip, playMatch, playMiss, playWin } = useSoundEffects();

  const prevFlippedLen = useRef(0);
  const prevLastResult = useRef(null);
  const prevGameWon = useRef(false);

  // Fetch cards whenever difficulty changes
  useEffect(() => {
    fetchCards(DIFFICULTY[difficulty].pairs);
  }, [difficulty, fetchCards]);

  // Sound effects based on game events
  useEffect(() => {
    if (flipped.length > prevFlippedLen.current) {
      playFlip();
    }
    prevFlippedLen.current = flipped.length;
  }, [flipped.length, playFlip]);

  useEffect(() => {
    if (lastResult === 'match' && prevLastResult.current !== 'match') playMatch();
    if (lastResult === 'miss'  && prevLastResult.current !== 'miss')  playMiss();
    prevLastResult.current = lastResult;
  }, [lastResult, playMatch, playMiss]);

  useEffect(() => {
    if (gameWon && !prevGameWon.current) playWin();
    prevGameWon.current = gameWon;
  }, [gameWon, playWin]);

  const cfg = DIFFICULTY[difficulty];
  const totalPairs = cfg.pairs;
  const matchedPairs = matched.size / 2;

  function handleNewGame() {
    fetchCards(cfg.pairs);
  }

  function handleDifficultyChange(d) {
    setDifficulty(d);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleYgo}>Yu-Gi-Oh!</span>
          <span className={styles.titleMemory}>Memory</span>
        </h1>

        <div className={styles.controls}>
          <div className={styles.difficultyGroup}>
            {Object.entries(DIFFICULTY).map(([key, val]) => (
              <button
                key={key}
                className={`${styles.diffBtn} ${difficulty === key ? styles.diffBtnActive : ''}`}
                onClick={() => handleDifficultyChange(key)}
              >
                {val.label}
              </button>
            ))}
          </div>
          <button className={styles.newGameBtn} onClick={handleNewGame}>
            New Cards
          </button>
        </div>
        {usingFallback && (
          <p className={styles.fallbackNotice}>
            ⚠️ Using offline cards — connect to the internet for new cards each game
          </p>
        )}
      </header>

      <GameStats
        turns={turns}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        elapsedTime={elapsedTime}
      />

      <GameBoard
        deck={deck}
        flipped={flipped}
        matched={matched}
        lastResult={lastResult}
        onCardClick={handleCardClick}
        columns={cfg.columns}
      />

      {gameWon && (
        <WinScreen
          turns={turns}
          totalPairs={totalPairs}
          elapsedTime={elapsedTime}
          onPlayAgain={resetGame}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}
