import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSecureCardView } from '../../src/capabilities/card-management/presentation/hooks/useSecureCardView';
import { GenerateSecureTokenUseCase } from '../../src/capabilities/card-management/domain/use-cases';
import { ShowSecureCardViewUseCase } from '../../src/capabilities/card-management/domain/use-cases';

jest.mock('../../src/capabilities/card-management/domain/use-cases');
jest.mock('fintech-secure-native', () => ({
  generateSecureToken: jest.fn(),
  validateToken: jest.fn(),
  openSecureView: jest.fn(),
  isAvailable: jest.fn(),
}));

const mockGenerateTokenUseCase = {
  execute: jest.fn(),
};

const mockShowSecureViewUseCase = {
  execute: jest.fn(),
};

const mockSecureToken = {
  cardId: 'card-001',
  token: 'mock-token-123',
  signature: 'mock-signature-456',
  expiresAt: Date.now() + 3600000,
};

const mockSecureViewResult = {
  success: true,
};

describe('useSecureCardView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      GenerateSecureTokenUseCase as jest.MockedClass<
        typeof GenerateSecureTokenUseCase
      >
    ).mockImplementation(() => mockGenerateTokenUseCase as any);
    (
      ShowSecureCardViewUseCase as jest.MockedClass<
        typeof ShowSecureCardViewUseCase
      >
    ).mockImplementation(() => mockShowSecureViewUseCase as any);
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSecureCardView());

    expect(result.current.loadingCardId).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.showSecureCard).toBe('function');
    expect(typeof result.current.isLoadingCard).toBe('function');
  });

  it('should show secure card successfully', async () => {
    mockGenerateTokenUseCase.execute.mockResolvedValue(mockSecureToken);
    mockShowSecureViewUseCase.execute.mockResolvedValue(mockSecureViewResult);

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.loadingCardId).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockGenerateTokenUseCase.execute).toHaveBeenCalledWith('card-001');
    expect(mockShowSecureViewUseCase.execute).toHaveBeenCalledWith({
      cardId: 'card-001',
      token: mockSecureToken.token,
    });
  });

  it('should set loading state during secure card view process', async () => {
    mockGenerateTokenUseCase.execute.mockImplementation(
      () =>
        new Promise(resolve => setTimeout(() => resolve(mockSecureToken), 100))
    );
    mockShowSecureViewUseCase.execute.mockResolvedValue(mockSecureViewResult);

    const { result } = renderHook(() => useSecureCardView());

    act(() => {
      result.current.showSecureCard('card-001');
    });

    expect(result.current.loadingCardId).toBe('card-001');
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loadingCardId).toBe(null);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle token generation error', async () => {
    const errorMessage = 'Token generation failed';
    mockGenerateTokenUseCase.execute.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.loadingCardId).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle secure view error', async () => {
    mockGenerateTokenUseCase.execute.mockResolvedValue(mockSecureToken);
    const errorMessage = 'Secure view failed';
    mockShowSecureViewUseCase.execute.mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.loadingCardId).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle unknown error in secure view', async () => {
    mockGenerateTokenUseCase.execute.mockResolvedValue(mockSecureToken);
    mockShowSecureViewUseCase.execute.mockResolvedValue({
      success: false,
    });

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.error).toBe('Failed to show secure view');
  });

  it('should handle unknown error type', async () => {
    mockGenerateTokenUseCase.execute.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.error).toBe('Unknown error');
  });

  it('should correctly identify loading card', () => {
    const { result } = renderHook(() => useSecureCardView());

    expect(result.current.isLoadingCard('card-001')).toBe(false);
    expect(result.current.isLoadingCard('card-002')).toBe(false);

    act(() => {
      result.current.showSecureCard('card-001');
    });

    expect(result.current.isLoadingCard('card-001')).toBe(true);
    expect(result.current.isLoadingCard('card-002')).toBe(false);
  });

  it('should handle multiple concurrent secure card requests', async () => {
    mockGenerateTokenUseCase.execute.mockResolvedValue(mockSecureToken);
    mockShowSecureViewUseCase.execute.mockResolvedValue(mockSecureViewResult);

    const { result } = renderHook(() => useSecureCardView());

    act(() => {
      result.current.showSecureCard('card-001');
    });

    expect(result.current.loadingCardId).toBe('card-001');

    act(() => {
      result.current.showSecureCard('card-002');
    });

    expect(result.current.loadingCardId).toBe('card-002');

    await waitFor(() => {
      expect(result.current.loadingCardId).toBe(null);
    });
  });

  it('should clear error when starting new request', async () => {
    mockGenerateTokenUseCase.execute.mockRejectedValue(
      new Error('First error')
    );

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      await result.current.showSecureCard('card-001');
    });

    expect(result.current.error).toBe('First error');

    mockGenerateTokenUseCase.execute.mockResolvedValue(mockSecureToken);
    mockShowSecureViewUseCase.execute.mockResolvedValue(mockSecureViewResult);

    await act(async () => {
      result.current.showSecureCard('card-002');
    });

    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loadingCardId).toBe(null);
    });
  });

  it('should handle network timeout in token generation', async () => {
    mockGenerateTokenUseCase.execute.mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
    );

    const { result } = renderHook(() => useSecureCardView());

    await act(async () => {
      result.current.showSecureCard('card-001');
    });

    await waitFor(
      () => {
        expect(result.current.loadingCardId).toBe(null);
      },
      { timeout: 200 }
    );

    expect(result.current.error).toBe('Network timeout');
  });
});
