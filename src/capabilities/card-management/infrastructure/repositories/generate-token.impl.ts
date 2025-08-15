import { generateSecureToken, validateToken } from 'fintech-secure-native';
import { TokenRepository } from '../../domain/repositories';
import { SecureToken } from '../../domain/entities';

export class TokenRepositoryImpl implements TokenRepository {
  async generateToken(cardId: string): Promise<SecureToken> {
    try {
      // Usar la función del paquete publicado
      const token = generateSecureToken(cardId);

      // Convertir al formato esperado por el dominio
      return {
        cardId: cardId,
        token: token.token,
        signature: token.signature,
        expiresAt: token.expiresAt,
      };
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate secure token');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Por ahora usamos una validación básica
      // En producción esto debería validar contra el backend
      return token.length > 0;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
