import { TokenRepositoryImpl } from '../../../src/capabilities/card-management/infrastructure/repositories/generate-token.impl';

jest.mock('fintech-secure-native', () => ({
  generateSecureToken: jest.fn(),
  validateToken: jest.fn(),
}));

describe('TokenRepositoryImpl', () => {
  let repository: TokenRepositoryImpl;
  let mockGenerateSecureToken: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    const fintechSecureNative = require('fintech-secure-native');
    mockGenerateSecureToken = fintechSecureNative.generateSecureToken;
    repository = new TokenRepositoryImpl();
  });

  describe('generateToken', () => {
    const mockTokenResponse = {
      token: 'mock-token-123',
      signature: 'mock-signature-456',
      expiresAt: Date.now() + 3600000,
    };

    it('should generate token successfully', async () => {
      mockGenerateSecureToken.mockReturnValue(mockTokenResponse);

      const result = await repository.generateToken('card-001');

      expect(result).toEqual({
        cardId: 'card-001',
        token: 'mock-token-123',
        signature: 'mock-signature-456',
        expiresAt: mockTokenResponse.expiresAt,
      });
      expect(mockGenerateSecureToken).toHaveBeenCalledWith('card-001');
    });

    it('should handle token generation error', async () => {
      const error = new Error('Token generation failed');
      mockGenerateSecureToken.mockImplementation(() => {
        throw error;
      });

      await expect(repository.generateToken('card-001')).rejects.toThrow(
        'Failed to generate secure token'
      );
      expect(mockGenerateSecureToken).toHaveBeenCalledWith('card-001');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const result = await repository.validateToken('valid-token');
      expect(result).toBe(true);
    });

    it('should return false for empty token', async () => {
      const result = await repository.validateToken('');
      expect(result).toBe(false);
    });

    it('should return true for token with only spaces', async () => {
      const result = await repository.validateToken('   ');
      expect(result).toBe(true);
    });
  });
});
