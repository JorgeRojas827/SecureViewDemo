import { CardRepositoryImpl } from '../../../src/capabilities/card-management/infrastructure/repositories/card-repository.impl';
import { CardDataService } from '../../../src/capabilities/card-management/infrastructure/datasources/card-data.service';
import { Card } from '../../../src/capabilities/card-management/domain/entities';

jest.mock(
  '../../../src/capabilities/card-management/infrastructure/datasources/card-data.service'
);

const mockCardDataService = {
  getUserCards: jest.fn(),
  getCard: jest.fn(),
};

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

describe('CardRepositoryImpl', () => {
  let repository: CardRepositoryImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    (
      CardDataService as jest.MockedClass<typeof CardDataService>
    ).mockImplementation(() => mockCardDataService as any);
    repository = new CardRepositoryImpl();
  });

  describe('getCards', () => {
    it('should return user cards successfully', async () => {
      mockCardDataService.getUserCards.mockResolvedValue(mockCards);

      const result = await repository.getCards();

      expect(result).toEqual(mockCards);
      expect(mockCardDataService.getUserCards).toHaveBeenCalledWith('user-001');
    });

    it('should return empty array when no cards', async () => {
      mockCardDataService.getUserCards.mockResolvedValue([]);

      const result = await repository.getCards();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockCardDataService.getUserCards.mockRejectedValue(error);

      await expect(repository.getCards()).rejects.toThrow('Service error');
    });

    it('should handle unknown errors', async () => {
      mockCardDataService.getUserCards.mockRejectedValue('Unknown error');

      await expect(repository.getCards()).rejects.toBe('Unknown error');
    });
  });

  describe('getCardById', () => {
    it('should return card when found', async () => {
      const card = mockCards[0];
      mockCardDataService.getCard.mockResolvedValue(card);

      const result = await repository.getCardById('card-001');

      expect(result).toEqual(card);
      expect(mockCardDataService.getCard).toHaveBeenCalledWith('card-001');
    });

    it('should return null when card not found', async () => {
      mockCardDataService.getCard.mockResolvedValue(null);

      const result = await repository.getCardById('non-existent');

      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockCardDataService.getCard.mockRejectedValue(error);

      await expect(repository.getCardById('card-001')).rejects.toThrow(
        'Service error'
      );
    });

    it('should handle unknown errors', async () => {
      mockCardDataService.getCard.mockRejectedValue('Unknown error');

      await expect(repository.getCardById('card-001')).rejects.toBe(
        'Unknown error'
      );
    });
  });
});
