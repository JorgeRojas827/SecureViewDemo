import { generateSecureToken } from 'fintech-secure-native';
import { SecureToken } from '../../domain/entities';
import { SecurityLoggerService } from './security-logger.service';

interface TokenRequest {
  cardId: string;
  userId: string;
}

export interface TokenResponse extends SecureToken {
  cardId: string;
}

export class SecureTokenService {
  private securityLogger = new SecurityLoggerService();

  async generateCardToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      if (!this.validateUserAccess(request.userId, request.cardId)) {
        throw new Error('Access denied for this card');
      }

      const secureToken = generateSecureToken(request.cardId);

      this.securityLogger.logSecurityEvent({
        eventType: 'TOKEN_GENERATED',
        cardId: request.cardId,
        userId: request.userId,
        riskLevel: 'LOW',
        metadata: {
          tokenLength: secureToken.token.length,
          expiresAt: secureToken.expiresAt,
        },
      });

      return {
        cardId: request.cardId,
        ...secureToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async renewToken(cardId: string, userId: string): Promise<TokenResponse> {
    return this.generateCardToken({ cardId, userId });
  }

  private validateUserAccess(userId: string, cardId: string): boolean {
    const userCards: Record<string, string[]> = {
      'user-001': ['card-001', 'card-002'],
    };

    const userCardIds = userCards[userId] || [];
    return userCardIds.includes(cardId);
  }
}
