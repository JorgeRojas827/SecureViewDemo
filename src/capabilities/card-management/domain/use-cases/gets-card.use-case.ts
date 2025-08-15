import { Card } from '../entities';
import { CardRepository } from '../repositories';

export class GetCardsUseCase {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(): Promise<Card[]> {
    return this.cardRepository.getCards();
  }
}
