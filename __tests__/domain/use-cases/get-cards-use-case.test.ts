import { GetCardsUseCase } from '../../../src/capabilities/card-management/domain/use-cases';
import { CardRepository } from '../../../src/capabilities/card-management/domain/repositories';
import { Card } from '../../../src/capabilities/card-management/domain/entities';

const mockCards: Card[] = [
  {
    cardId: 'card-001',
    alias: 'Tarjeta Principal',
    brand: 'VISA',
    maskedPan: '**** **** **** 1234',
    holder: 'Juan Pérez',
    expiry: '12/25',
    accountId: 'account-001',
    cardType: 'DEBIT',
  },
  {
    cardId: 'card-002',
    alias: 'Tarjeta Secundaria',
    brand: 'MASTERCARD',
    maskedPan: '**** **** **** 5678',
    holder: 'Juan Pérez',
    expiry: '06/26',
    accountId: 'account-002',
    cardType: 'DEBIT',
  },
];

describe('GetCardsUseCase', () => {
  let mockCardRepository: jest.Mocked<CardRepository>;
  let useCase: GetCardsUseCase;

  beforeEach(() => {
    mockCardRepository = {
      getCards: jest.fn(),
      getCardById: jest.fn(),
    };
    useCase = new GetCardsUseCase(mockCardRepository);
  });

  it('should return cards successfully', async () => {
    mockCardRepository.getCards.mockResolvedValue(mockCards);

    const result = await useCase.execute();

    expect(result).toEqual(mockCards);
    expect(mockCardRepository.getCards).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no cards', async () => {
    mockCardRepository.getCards.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockCardRepository.getCards).toHaveBeenCalledTimes(1);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Repository error');
    mockCardRepository.getCards.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Repository error');
    expect(mockCardRepository.getCards).toHaveBeenCalledTimes(1);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network timeout');
    mockCardRepository.getCards.mockRejectedValue(networkError);

    await expect(useCase.execute()).rejects.toThrow('Network timeout');
  });

  it('should handle unknown errors', async () => {
    mockCardRepository.getCards.mockRejectedValue('Unknown error');

    await expect(useCase.execute()).rejects.toBe('Unknown error');
  });
});
