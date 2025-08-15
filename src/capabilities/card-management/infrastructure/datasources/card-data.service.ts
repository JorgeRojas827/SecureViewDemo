import type { Card } from '../../domain/entities/card.entity';
import type { SecureCardData } from '../../domain/entities/secure-card-data.entity';

export interface MockCardDatabase {
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
        alias: 'Mi Tarjeta Principal',
        maskedPan: '**** **** **** 1111',
        brand: 'VISA',
        holder: 'JORGE LUIS ROJAS',
        expiry: '12/25',
        accountId: 'account-001',
        cardType: 'CREDIT',
      },
      secureData: {
        cardId: 'card-001',
        fullPan: '4111111111111111',
        cvv: '123',
        holder: 'JORGE LUIS ROJAS',
        expiry: '12/25',
        brand: 'VISA',
      },
    },
    'card-002': {
      card: {
        cardId: 'card-002',
        alias: 'Tarjeta de Débito',
        maskedPan: '**** **** **** 2222',
        brand: 'MASTERCARD',
        holder: 'JORGE LUIS ROJAS',
        expiry: '08/26',
        accountId: 'account-001',
        cardType: 'DEBIT',
      },
      secureData: {
        cardId: 'card-002',
        fullPan: '5555555555552222',
        cvv: '456',
        holder: 'JORGE LUIS ROJAS',
        expiry: '08/26',
        brand: 'MASTERCARD',
      },
    },
    'card-003': {
      card: {
        cardId: 'card-003',
        alias: 'Tarjeta Empresarial',
        maskedPan: '**** **** **** 3333',
        brand: 'AMEX',
        holder: 'JORGE LUIS ROJAS',
        expiry: '03/27',
        accountId: 'account-002',
        cardType: 'CREDIT',
      },
      secureData: {
        cardId: 'card-003',
        fullPan: '3333333333333333',
        cvv: '789',
        holder: 'JORGE LUIS ROJAS',
        expiry: '03/27',
        brand: 'AMEX',
      },
    },
  };

  /**
   * Obtiene todas las tarjetas de un usuario
   */
  async getUserCards(userId: string): Promise<Card[]> {
    try {
      // Simular delay de red
      await this.delay(500);

      // En producción consultaría la base de datos por userId
      const userCardIds = this.getUserCardIds(userId);

      const cards = userCardIds
        .map(cardId => this.mockDatabase[cardId]?.card)
        .filter(Boolean);

      this.logCardAccess(userId, 'CARDS_LISTED', userCardIds);

      return cards;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      throw error;
    }
  }

  /**
   * Obtiene una tarjeta específica
   */
  async getCard(cardId: string): Promise<Card | null> {
    try {
      await this.delay(200);

      const cardData = this.mockDatabase[cardId];
      if (!cardData) {
        return null;
      }

      return cardData.card;
    } catch (error) {
      console.error('Error fetching card:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos sensibles de una tarjeta (requiere validación previa)
   */
  async getSecureCardData(cardId: string): Promise<SecureCardData | null> {
    try {
      await this.delay(300);

      const cardData = this.mockDatabase[cardId];
      if (!cardData) {
        return null;
      }

      this.logCardAccess('system', 'SECURE_DATA_ACCESSED', [cardId]);

      return cardData.secureData;
    } catch (error) {
      console.error('Error fetching secure card data:', error);
      throw error;
    }
  }

  /**
   * Obtiene los IDs de tarjetas de un usuario (simulado)
   */
  private getUserCardIds(userId: string): string[] {
    const userCards: Record<string, string[]> = {
      'user-001': ['card-001', 'card-002'],
      'user-002': ['card-003'],
    };

    return userCards[userId] || [];
  }

  /**
   * Simula delay de red
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log de auditoría para acceso a tarjetas
   */
  private logCardAccess(
    userId: string,
    action: string,
    cardIds: string[],
  ): void {
    const logEntry = {
      event: action,
      userId,
      cardIds,
      timestamp: new Date().toISOString(),
    };

    console.log('Card Access Audit:', JSON.stringify(logEntry));
  }
}
