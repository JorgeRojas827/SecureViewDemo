import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../../domain/entities';
import { GetCardsUseCase } from '../../domain/use-cases';
import { CardRepositoryImpl } from '../../infrastructure/repositories/card-repository.impl';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCardsUseCase = useMemo(
    () => new GetCardsUseCase(new CardRepositoryImpl()),
    []
  );

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cardsData = await getCardsUseCase.execute();
      setCards(cardsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getCardsUseCase]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    loading,
    error,
    refetch: loadCards,
  };
};
