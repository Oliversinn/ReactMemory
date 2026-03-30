import { useEffect, useRef } from 'react';
import styles from '../styles/WinScreen.module.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getRating(turns, totalPairs) {
  const ratio = turns / totalPairs;
  if (ratio <= 1.3) return { stars: 3, label: 'Legendary Duelist!' };
  if (ratio <= 2.0) return { stars: 2, label: 'Expert Duelist!' };
  return { stars: 1, label: 'Apprentice Duelist' };
}

/**
 * Celebration overlay shown when the player wins.
 */
export default function WinScreen({ turns, totalPairs, elapsedTime, onPlayAgain, onNewGame }) {
  const { stars, label } = getRating(turns, totalPairs);
  const canvasRef = useRef(null);

  // Simple confetti animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 5,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#7B68EE', '#FF9F43'][Math.floor(Math.random() * 5)],
    }));

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={styles.overlay}>
      <canvas ref={canvasRef} className={styles.confetti} />
      <div className={styles.panel}>
        <h1 className={styles.title}>Victory!</h1>
        <p className={styles.subtitle}>{label}</p>

        <div className={styles.stars}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={n <= stars ? styles.starFilled : styles.starEmpty}
              style={{ animationDelay: `${n * 0.15}s` }}
            >
              ★
            </span>
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{turns}</span>
            <span className={styles.statLabel}>Turns</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
            <span className={styles.statLabel}>Time</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onPlayAgain}>
            Play Again
          </button>
          <button className={styles.btnSecondary} onClick={onNewGame}>
            New Cards
          </button>
        </div>
      </div>
    </div>
  );
}
