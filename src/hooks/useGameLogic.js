import { useReducer, useCallback, useEffect, useRef } from 'react';

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(uniqueCards) {
  const paired = uniqueCards.flatMap((card, idx) => [
    { ...card, instanceId: `${card.id}-a-${idx}` },
    { ...card, instanceId: `${card.id}-b-${idx}` },
  ]);
  return shuffle(paired);
}

// ── Reducer ──────────────────────────────────────────────────────────────────

const initialState = {
  deck: [],
  flipped: [],
  matched: new Set(),
  turns: 0,
  isChecking: false,
  lastResult: null,
  gameStarted: false,
  elapsedTime: 0,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'INIT_DECK':
      return {
        ...initialState,
        deck: action.deck,
      };

    case 'RESET_DECK':
      return {
        ...initialState,
        deck: shuffle(state.deck),
      };

    case 'FLIP_CARD':
      return {
        ...state,
        gameStarted: true,
        flipped: [...state.flipped, action.instanceId],
      };

    case 'FLIP_SECOND_CARD':
      return {
        ...state,
        turns: state.turns + 1,
        isChecking: true,
        flipped: [...state.flipped, action.instanceId],
        lastResult: action.isMatch ? 'match' : 'miss',
      };

    case 'CONFIRM_MATCH':
      return {
        ...state,
        matched: new Set([...state.matched, ...action.instanceIds]),
        flipped: [],
        isChecking: false,
        lastResult: null,
      };

    case 'CONFIRM_MISS':
      return {
        ...state,
        flipped: [],
        isChecking: false,
        lastResult: null,
      };

    case 'TICK':
      return { ...state, elapsedTime: action.elapsed };

    default:
      return state;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Core game logic hook for the memory card game.
 */
export function useGameLogic(uniqueCards) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Build deck when unique cards change
  useEffect(() => {
    if (uniqueCards.length === 0) return;
    dispatch({ type: 'INIT_DECK', deck: buildDeck(uniqueCards) });
    if (timerRef.current) clearInterval(timerRef.current);
  }, [uniqueCards]);

  // Derive win state — must be declared before the effects that reference it
  const gameWon = state.deck.length > 0 && state.matched.size === state.deck.length;

  // Timer management — only starts when the game begins; the win effect stops it
  useEffect(() => {
    if (!state.gameStarted) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      dispatch({
        type: 'TICK',
        elapsed: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.gameStarted]);

  // Stop timer when game is won
  useEffect(() => {
    if (gameWon && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [gameWon]);

  const handleCardClick = useCallback(
    (instanceId) => {
      if (state.isChecking) return;
      if (state.flipped.includes(instanceId)) return;
      if (state.matched.has(instanceId)) return;
      if (state.flipped.length >= 2) return;

      if (state.flipped.length === 0) {
        dispatch({ type: 'FLIP_CARD', instanceId });
        return;
      }

      // Second card
      const firstCard = state.deck.find((c) => c.instanceId === state.flipped[0]);
      const secondCard = state.deck.find((c) => c.instanceId === instanceId);
      const isMatch = firstCard.id === secondCard.id;

      dispatch({ type: 'FLIP_SECOND_CARD', instanceId, isMatch });

      if (isMatch) {
        setTimeout(() => {
          dispatch({ type: 'CONFIRM_MATCH', instanceIds: [state.flipped[0], instanceId] });
        }, 700);
      } else {
        setTimeout(() => {
          dispatch({ type: 'CONFIRM_MISS' });
        }, 1000);
      }
    },
    [state]
  );

  const resetGame = useCallback(() => {
    if (state.deck.length === 0) return;
    dispatch({ type: 'RESET_DECK' });
    if (timerRef.current) clearInterval(timerRef.current);
  }, [state.deck.length]);

  return {
    deck: state.deck,
    flipped: state.flipped,
    matched: state.matched,
    turns: state.turns,
    isChecking: state.isChecking,
    lastResult: state.lastResult,
    gameWon,
    elapsedTime: state.elapsedTime,
    handleCardClick,
    resetGame,
  };
}
