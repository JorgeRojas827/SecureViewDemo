import { SecureTokenService } from '../../../src/capabilities/card-management/infrastructure/datasources/secure-token.service';

jest.mock('fintech-secure-native', () => ({
  generateSecureToken: jest.fn(),
  validateToken: jest.fn(),
}));

describe('SecureTokenService', () => {
  let service: SecureTokenService;
  let mockGenerateSecureToken: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SecureTokenService();

    const fintechSecureNative = require('fintech-secure-native');
    mockGenerateSecureToken = fintechSecureNative.generateSecureToken;
  });

  describe('generateCardToken', () => {
    it('should generate card token successfully', async () => {
      const mockTokenData = {
        token: 'mock-token-123',
        signature: 'mock-signature-456',
        expiresAt: Date.now() + 3600000,
      };

      mockGenerateSecureToken.mockReturnValue(mockTokenData);

      const result = await service.generateCardToken({
        cardId: 'card-001',
        userId: 'user-001',
      });

      expect(result.token).toBe('mock-token-123');
      expect(result.signature).toBe('mock-signature-456');
      expect(result.cardId).toBe('card-001');
      expect(mockGenerateSecureToken).toHaveBeenCalledWith('card-001');
    });

    it('should handle access denied', async () => {
      await expect(
        service.generateCardToken({
          cardId: 'invalid-card',
          userId: 'user-001',
        })
      ).rejects.toThrow('Access denied for this card');
    });

    it('should handle native module errors', async () => {
      const error = new Error('Native module error');
      mockGenerateSecureToken.mockImplementation(() => {
        throw error;
      });

      await expect(
        service.generateCardToken({
          cardId: 'card-001',
          userId: 'user-001',
        })
      ).rejects.toThrow('Native module error');
    });
  });

  describe('renewToken', () => {
    it('should renew token successfully', async () => {
      const mockTokenData = {
        token: 'renewed-token-123',
        signature: 'renewed-signature-456',
        expiresAt: Date.now() + 3600000,
      };

      mockGenerateSecureToken.mockReturnValue(mockTokenData);

      const result = await service.renewToken('card-001', 'user-001');

      expect(result.token).toBe('renewed-token-123');
      expect(result.cardId).toBe('card-001');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from generateSecureToken', async () => {
      const fintechSecureNative = require('fintech-secure-native');
      fintechSecureNative.generateSecureToken.mockImplementation(() => {
        throw new Error('Native module error');
      });

      await expect(
        service.generateCardToken({
          cardId: 'card-001',
          userId: 'user-001',
        })
      ).rejects.toThrow('Native module error');
    });

    it('should handle security logger errors gracefully', async () => {
      const mockSecurityLogger = {
        logSecurityEvent: jest.fn().mockImplementation(() => {
          throw new Error('Logger error');
        }),
      };

      (service as any).securityLogger = mockSecurityLogger;

      const fintechSecureNative = require('fintech-secure-native');
      fintechSecureNative.generateSecureToken.mockReturnValue({
        token: 'mock-token-123',
        signature: 'mock-signature-456',
        expiresAt: Date.now() + 3600000,
      });

      await expect(
        service.generateCardToken({
          cardId: 'card-001',
          userId: 'user-001',
        })
      ).rejects.toThrow('Logger error');
    });
  });
});
