export type Brand = 'VISA' | 'MASTERCARD' | 'AMEX';
export type CardType = 'CREDIT' | 'DEBIT';

export interface Card {
  cardId: string;
  alias: string;
  maskedPan: string;
  brand: Brand;
  holder: string;
  expiry: string;
  accountId: string;
  cardType: CardType;
}
