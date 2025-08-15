import { useState, useEffect } from 'react';
import { Card } from '../../domain/entities';
import { GetCardsUseCase } from '../../domain/use-cases';
import { CardRepositoryImpl } from '../../infrastructure/repositories/card-repository.impl';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCardsUseCase = new GetCardsUseCase(new CardRepositoryImpl());

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading cards...');

      const cardsData = await getCardsUseCase.execute();
      setCards(cardsData);

      console.log('Cards loaded successfully:', cardsData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return {
    cards,
    loading,
    error,
    refetch: loadCards,
  };
};
