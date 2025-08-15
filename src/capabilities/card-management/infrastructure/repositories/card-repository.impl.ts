import { CardRepository } from '../../domain/repositories';
import { Card } from '../../domain/entities';
import { CardDataService } from '../datasources/card-data.service';

export class CardRepositoryImpl implements CardRepository {
  private cardDataService = new CardDataService();

  async getCards(): Promise<Card[]> {
    try {
      // En producción obtener userId del contexto de autenticación
      const userId = 'user-001';
      return await this.cardDataService.getUserCards(userId);
    } catch (error) {
      console.error('Error fetching cards from repository:', error);
      throw error;
    }
  }

  async getCardById(cardId: string): Promise<Card | null> {
    try {
      return await this.cardDataService.getCard(cardId);
    } catch (error) {
      console.error('Error fetching card by ID from repository:', error);
      throw error;
    }
  }
}
