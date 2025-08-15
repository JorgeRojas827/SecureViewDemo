import { Card } from '../entities';
import { CardRepository } from '../repositories';

export class GetCardsUseCase {
  constructor(private cardRepository: CardRepository) {}

  async execute(): Promise<Card[]> {
    return await this.cardRepository.getCards();
  }
}
