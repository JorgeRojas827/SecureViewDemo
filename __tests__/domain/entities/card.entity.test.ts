import {
  Card,
  Brand,
  CardType,
} from '../../../src/capabilities/card-management/domain/entities/card.entity';

describe('Card Entity', () => {
  const mockCardData: Card = {
    cardId: 'card-001',
    alias: 'Tarjeta Principal',
    brand: 'VISA' as Brand,
    maskedPan: '**** **** **** 1234',
    holder: 'Juan Pérez',
    expiry: '12/25',
    accountId: 'account-001',
    cardType: 'DEBIT' as CardType,
  };

  it('should create a card with valid data', () => {
    const card: Card = mockCardData;

    expect(card.cardId).toBe('card-001');
    expect(card.alias).toBe('Tarjeta Principal');
    expect(card.brand).toBe('VISA');
    expect(card.maskedPan).toBe('**** **** **** 1234');
    expect(card.holder).toBe('Juan Pérez');
    expect(card.expiry).toBe('12/25');
    expect(card.accountId).toBe('account-001');
    expect(card.cardType).toBe('DEBIT');
  });

  it('should create a card with different card types', () => {
    const creditCard: Card = {
      ...mockCardData,
      cardType: 'CREDIT' as CardType,
    };

    expect(creditCard.cardType).toBe('CREDIT');
  });

  it('should handle different brands', () => {
    const mastercard: Card = {
      ...mockCardData,
      brand: 'MASTERCARD' as Brand,
    };

    expect(mastercard.brand).toBe('MASTERCARD');
  });

  it('should handle empty or null values', () => {
    const cardWithEmptyValues: Card = {
      ...mockCardData,
      alias: '',
      holder: '',
    };

    expect(cardWithEmptyValues.alias).toBe('');
    expect(cardWithEmptyValues.holder).toBe('');
  });

  it('should maintain data integrity', () => {
    const card: Card = mockCardData;

    const cardObject = {
      cardId: card.cardId,
      alias: card.alias,
      brand: card.brand,
      maskedPan: card.maskedPan,
      holder: card.holder,
      expiry: card.expiry,
      accountId: card.accountId,
      cardType: card.cardType,
    };

    expect(cardObject).toEqual(mockCardData);
  });
});
