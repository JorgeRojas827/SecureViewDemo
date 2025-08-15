import { generateSecureToken } from 'fintech-secure-native';
import { TokenRepository } from '../../domain/repositories';
import { SecureToken } from '../../domain/entities';

export class TokenRepositoryImpl implements TokenRepository {
  async generateToken(cardId: string): Promise<SecureToken> {
    try {
      const token = generateSecureToken(cardId);

      return {
        cardId,
        token: token.token,
        signature: token.signature,
        expiresAt: token.expiresAt,
      };
    } catch (error) {
      throw new Error('Failed to generate secure token');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      return token.length > 0;
    } catch (error) {
      return false;
    }
  }
}
