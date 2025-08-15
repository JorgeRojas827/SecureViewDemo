import { CardDataService } from '../../../src/capabilities/card-management/infrastructure/datasources/card-data.service';

describe('CardDataService', () => {
  let service: CardDataService;

  beforeEach(() => {
    service = new CardDataService();
  });

  describe('getUserCards', () => {
    it('should return user cards successfully', async () => {
      const result = await service.getUserCards('user-001');

      expect(result).toHaveLength(2);
      expect(result[0].cardId).toBe('card-001');
      expect(result[1].cardId).toBe('card-002');
    });

    it('should return empty array for unknown user', async () => {
      const result = await service.getUserCards('unknown-user');

      expect(result).toEqual([]);
    });

    it('should handle service errors gracefully', async () => {
      const result = await service.getUserCards('user-001');

      expect(result).toHaveLength(2);
    });
  });

  describe('getCard', () => {
    it('should return card when found', async () => {
      const result = await service.getCard('card-001');

      expect(result).toBeTruthy();
      expect(result?.cardId).toBe('card-001');
      expect(result?.alias).toBe('Tarjeta Principal');
      expect(result?.brand).toBe('VISA');
    });

    it('should return null when card not found', async () => {
      const result = await service.getCard('non-existent');

      expect(result).toBeNull();
    });

    it('should return card with correct structure', async () => {
      const result = await service.getCard('card-001');

      expect(result).toMatchObject({
        cardId: 'card-001',
        alias: 'Tarjeta Principal',
        brand: 'VISA',
        maskedPan: '**** **** **** 1234',
        holder: '****',
        expiry: '****',
        accountId: 'account-001',
        cardType: 'DEBIT',
      });
    });
  });

  describe('getSecureCardData', () => {
    it('should return secure data when found', async () => {
      const result = await service.getSecureCardData('card-001');

      expect(result).toBeTruthy();
      expect(result?.fullPan).toBe('4111111111111234');
      expect(result?.cvv).toBe('123');
      expect(result?.holder).toBe('Juan Pérez');
      expect(result?.expiry).toBe('12/25');
    });

    it('should return null when card not found', async () => {
      const result = await service.getSecureCardData('non-existent');

      expect(result).toBeNull();
    });

    it('should return secure data with correct structure', async () => {
      const result = await service.getSecureCardData('card-001');

      expect(result).toMatchObject({
        fullPan: '4111111111111234',
        cvv: '123',
        holder: 'Juan Pérez',
        expiry: '12/25',
      });
    });
  });

  describe('getUserCardIds', () => {
    it('should return correct card IDs for known user', () => {
      const result = service['getUserCardIds']('user-001');

      expect(result).toEqual(['card-001', 'card-002']);
    });

    it('should return empty array for unknown user', () => {
      const result = service['getUserCardIds']('unknown-user');

      expect(result).toEqual([]);
    });
  });

  describe('data consistency', () => {
    it('should maintain consistency between card and secure data', async () => {
      const card = await service.getCard('card-001');
      const secureData = await service.getSecureCardData('card-001');

      expect(card).toBeTruthy();
      expect(secureData).toBeTruthy();
      expect(card?.holder).toBe('****');
      expect(card?.expiry).toBe('****');
      expect(secureData?.holder).toBe('Juan Pérez');
      expect(secureData?.expiry).toBe('12/25');
    });

    it('should have valid card brands', async () => {
      const cards = await service.getUserCards('user-001');

      cards.forEach(card => {
        expect(['VISA', 'MASTERCARD', 'AMEX']).toContain(card.brand);
      });
    });

    it('should have valid card types', async () => {
      const cards = await service.getUserCards('user-001');

      cards.forEach(card => {
        expect(['CREDIT', 'DEBIT']).toContain(card.cardType);
      });
    });
  });
});
