import { SecureToken } from '../../../src/capabilities/card-management/domain/entities/secure-token.entity';

describe('SecureToken Entity', () => {
  const mockTokenData: SecureToken = {
    token: 'mock-token-123',
    cardId: 'card-001',
    signature: 'mock-signature-456',
    expiresAt: Date.now() + 3600000,
  };

  it('should create a secure token with valid data', () => {
    const secureToken: SecureToken = mockTokenData;

    expect(secureToken.token).toBe('mock-token-123');
    expect(secureToken.signature).toBe('mock-signature-456');
    expect(secureToken.expiresAt).toBe(mockTokenData.expiresAt);
  });

  it('should handle different token formats', () => {
    const secureTokenWithDifferentToken: SecureToken = {
      ...mockTokenData,
      token: 'different-token-789',
    };

    expect(secureTokenWithDifferentToken.token).toBe('different-token-789');
  });

  it('should handle different signature formats', () => {
    const secureTokenWithDifferentSignature: SecureToken = {
      ...mockTokenData,
      signature: 'different-signature-789',
    };

    expect(secureTokenWithDifferentSignature.signature).toBe(
      'different-signature-789'
    );
  });

  it('should handle different expiry times', () => {
    const futureTime = Date.now() + 7200000;
    const secureTokenWithDifferentExpiry: SecureToken = {
      ...mockTokenData,
      expiresAt: futureTime,
    };

    expect(secureTokenWithDifferentExpiry.expiresAt).toBe(futureTime);
  });

  it('should maintain data integrity', () => {
    const secureToken: SecureToken = mockTokenData;

    const tokenObject = {
      token: secureToken.token,
      cardId: secureToken.cardId,
      signature: secureToken.signature,
      expiresAt: secureToken.expiresAt,
    };

    expect(tokenObject).toEqual(mockTokenData);
  });

  it('should handle expired tokens', () => {
    const expiredTime = Date.now() - 3600000;
    const expiredToken: SecureToken = {
      ...mockTokenData,
      expiresAt: expiredTime,
    };

    expect(expiredToken.expiresAt).toBe(expiredTime);
  });

  it('should handle current time tokens', () => {
    const currentTime = Date.now();
    const currentToken: SecureToken = {
      ...mockTokenData,
      expiresAt: currentTime,
    };

    expect(currentToken.expiresAt).toBe(currentTime);
  });

  it('should handle empty token and signature', () => {
    const emptyToken: SecureToken = {
      token: '',
      cardId: 'card-001',
      signature: '',
      expiresAt: Date.now() + 3600000,
    };

    expect(emptyToken.token).toBe('');
    expect(emptyToken.signature).toBe('');
  });
});
