import styles from '../styles/Card.module.css';

/**
 * A single memory card that flips to reveal its face.
 */
export default function Card({ card, isFlipped, isMatched, isLastMiss, onClick }) {
  function handleClick() {
    if (!isFlipped && !isMatched) {
      onClick(card.instanceId);
    }
  }

  const cardClass = [
    styles.card,
    isFlipped || isMatched ? styles.flipped : '',
    isMatched ? styles.matched : '',
    isLastMiss ? styles.miss : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} onClick={handleClick} role="button" aria-label={isFlipped || isMatched ? card.name : 'Hidden card'} tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}>
      <div className={styles.inner}>
        {/* Back face */}
        <div className={styles.back}>
          <div className={styles.backPattern} />
        </div>
        {/* Front face */}
        <div className={styles.front}>
          <img src={card.image} alt={card.name} loading="lazy" />
          <span className={styles.cardName}>{card.name}</span>
        </div>
      </div>
    </div>
  );
}
