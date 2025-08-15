import { Card, SecureCardData } from '../../domain/entities';

interface MockCardDatabase {
  [cardId: string]: {
    card: Card;
    secureData: SecureCardData;
  };
}

export class CardDataService {
  private mockDatabase: MockCardDatabase = {
    'card-001': {
      card: {
        cardId: 'card-001',
        alias: 'Tarjeta Principal',
        brand: 'VISA',
        maskedPan: '**** **** **** 1234',
        holder: '****',
        expiry: '****',
        accountId: 'account-001',
        cardType: 'DEBIT',
      },
      secureData: {
        fullPan: '4111111111111234',
        cvv: '123',
        expiry: '12/25',
        holder: 'Juan Pérez',
      },
    },
    'card-002': {
      card: {
        cardId: 'card-002',
        alias: 'Tarjeta Secundaria',
        brand: 'MASTERCARD',
        maskedPan: '**** **** **** 5678',
        holder: '****',
        expiry: '****',
        accountId: 'account-002',
        cardType: 'DEBIT',
      },
      secureData: {
        fullPan: '5555555555554444',
        cvv: '456',
        expiry: '06/26',
        holder: 'Juan Pérez',
      },
    },
  };

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUserCards(userId: string): Promise<Card[]> {
    try {
      await this.delay(500);

      const userCardIds = this.getUserCardIds(userId);
      const userCards = userCardIds
        .map(cardId => this.mockDatabase[cardId]?.card)
        .filter(Boolean) as Card[];

      return userCards;
    } catch (error) {
      throw error;
    }
  }

  async getCard(cardId: string): Promise<Card | null> {
    try {
      await this.delay(200);

      const cardData = this.mockDatabase[cardId];
      if (!cardData) {
        return null;
      }

      return cardData.card;
    } catch (error) {
      throw error;
    }
  }

  async getSecureCardData(cardId: string): Promise<SecureCardData | null> {
    try {
      await this.delay(300);

      const cardData = this.mockDatabase[cardId];
      if (!cardData) {
        return null;
      }

      return cardData.secureData;
    } catch (error) {
      throw error;
    }
  }

  private getUserCardIds(userId: string): string[] {
    const userCards: Record<string, string[]> = {
      'user-001': ['card-001', 'card-002'],
    };
    return userCards[userId] || [];
  }
}
