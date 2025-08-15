import { Card } from '../entities';

export interface CardRepository {
  getCards(): Promise<Card[]>;
  getCardById(cardId: string): Promise<Card | null>;
}
