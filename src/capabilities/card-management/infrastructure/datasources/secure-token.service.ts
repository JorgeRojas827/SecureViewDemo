import { generateSecureToken } from 'fintech-secure-native';
import { SecurityLoggerService } from './security-logger.service';

export interface SecureToken {
  token: string;
  signature: string;
  expiresAt: number;
}

export interface TokenRequest {
  cardId: string;
  userId: string;
}

export interface TokenResponse extends SecureToken {
  cardId: string;
}

export class SecureTokenService {
  private securityLogger = new SecurityLoggerService();

  /**
   * Genera un token seguro para acceder a los datos de una tarjeta
   */
  async generateCardToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      // Validar permisos del usuario (simulado)
      if (!this.validateUserAccess(request.userId, request.cardId)) {
        throw new Error('Access denied for this card');
      }

      // Generar token usando la librería
      const secureToken = generateSecureToken(request.cardId);

      // Log de auditoría de seguridad
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
      console.error('Error generating secure token:', error);
      throw error;
    }
  }

  /**
   * Renueva un token existente
   */
  async renewToken(cardId: string, userId: string): Promise<TokenResponse> {
    return this.generateCardToken({ cardId, userId });
  }

  /**
   * Valida si un usuario tiene acceso a una tarjeta (simulado)
   */
  private validateUserAccess(userId: string, cardId: string): boolean {
    // En producción esto consultaría la base de datos
    const userCards = this.getUserCards(userId);
    return userCards.includes(cardId);
  }

  /**
   * Obtiene las tarjetas del usuario (simulado)
   */
  private getUserCards(userId: string): string[] {
    // Simulación de tarjetas por usuario
    const mockUserCards: Record<string, string[]> = {
      'user-001': ['card-001', 'card-002'],
      'user-002': ['card-003', 'card-004'],
    };

    return mockUserCards[userId] || [];
  }

  /**
   * Obtiene eventos de seguridad recientes
   */
  getSecurityEvents(limit: number = 10) {
    return this.securityLogger.getRecentEvents(limit);
  }
}
