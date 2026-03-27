import Card from './Card';
import styles from '../styles/GameBoard.module.css';

/**
 * Renders the grid of memory cards.
 */
export default function GameBoard({ deck, flipped, matched, lastResult, onCardClick, columns }) {
  // The two cards that were just flipped (for miss animation)
  const missCards = lastResult === 'miss' ? flipped : [];

  return (
    <div
      className={styles.board}
      style={{ '--columns': columns }}
    >
      {deck.map((card) => (
        <Card
          key={card.instanceId}
          card={card}
          isFlipped={flipped.includes(card.instanceId)}
          isMatched={matched.has(card.instanceId)}
          isLastMiss={missCards.includes(card.instanceId)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
