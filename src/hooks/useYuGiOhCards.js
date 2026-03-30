import { useState, useCallback } from 'react';
import { FALLBACK_CARDS } from './fallbackCards';

const YGOPRODECK_API = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
// Approximate total number of cards in the database
const APPROX_TOTAL_CARDS = 10000;

/**
 * Fetches a set of random Yu-Gi-Oh! cards from the YGOPRODeck API.
 * Each call selects a random offset to ensure variety between games.
 * Falls back to local card images when the API is unreachable.
 */
export function useYuGiOhCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchCards = useCallback(async (count = 8) => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const offset = Math.floor(Math.random() * (APPROX_TOTAL_CARDS - count));
      const url = `${YGOPRODECK_API}?num=${count}&offset=${offset}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const fetched = data.data ?? [];

      if (fetched.length < count) {
        throw new Error('Not enough cards returned from the API');
      }

      const mapped = fetched.slice(0, count).map((card) => ({
        id: card.id,
        name: card.name,
        image: card.card_images[0].image_url_small ?? card.card_images[0].image_url,
      }));

      setCards(mapped);
    } catch {
      // API unavailable — use local fallback cards
      const shuffled = [...FALLBACK_CARDS].sort(() => Math.random() - 0.5);
      setCards(shuffled.slice(0, Math.min(count, FALLBACK_CARDS.length)));
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cards, loading, error, usingFallback, fetchCards };
}
