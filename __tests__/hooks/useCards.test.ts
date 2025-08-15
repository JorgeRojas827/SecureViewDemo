import { renderHook, waitFor } from '@testing-library/react-native';
import { useCards } from '../../src/capabilities/card-management/presentation/hooks/useCards';
import { GetCardsUseCase } from '../../src/capabilities/card-management/domain/use-cases';

jest.mock('../../src/capabilities/card-management/domain/use-cases');
jest.mock(
  '../../src/capabilities/card-management/infrastructure/repositories/card-repository.impl'
);

const mockGetCardsUseCase = {
  execute: jest.fn(),
};

const mockCards = [
  {
    cardId: 'card-001',
    alias: 'Tarjeta Principal',
    brand: 'VISA' as const,
    maskedPan: '**** **** **** 1234',
    holder: 'Juan Pérez',
    expiry: '12/25',
    accountId: 'account-001',
    cardType: 'DEBIT' as const,
  },
  {
    cardId: 'card-002',
    alias: 'Tarjeta Secundaria',
    brand: 'MASTERCARD' as const,
    maskedPan: '**** **** **** 5678',
    holder: 'Juan Pérez',
    expiry: '06/26',
    accountId: 'account-002',
    cardType: 'DEBIT' as const,
  },
];

describe('useCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      GetCardsUseCase as jest.MockedClass<typeof GetCardsUseCase>
    ).mockImplementation(() => mockGetCardsUseCase as any);
  });

  it('should load cards successfully', async () => {
    mockGetCardsUseCase.execute.mockResolvedValue(mockCards);

    const { result } = renderHook(() => useCards());

    expect(result.current.loading).toBe(true);
    expect(result.current.cards).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.error).toBe(null);
    expect(mockGetCardsUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle loading error', async () => {
    const errorMessage = 'Failed to load cards';
    mockGetCardsUseCase.execute.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCards());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockGetCardsUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle unknown error', async () => {
    mockGetCardsUseCase.execute.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useCards());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Unknown error');
  });

  it('should provide refetch function', () => {
    mockGetCardsUseCase.execute.mockResolvedValue(mockCards);

    const { result } = renderHook(() => useCards());

    expect(typeof result.current.refetch).toBe('function');
  });

  it('should return empty array when no cards are returned', async () => {
    mockGetCardsUseCase.execute.mockResolvedValue([]);

    const { result } = renderHook(() => useCards());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle network timeout', async () => {
    mockGetCardsUseCase.execute.mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
    );

    const { result } = renderHook(() => useCards());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 200 }
    );

    expect(result.current.error).toBe('Network timeout');
  });

  it('should maintain cards state during refetch', async () => {
    mockGetCardsUseCase.execute.mockResolvedValue(mockCards);

    const { result } = renderHook(() => useCards());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCards = result.current.cards;

    result.current.refetch();

    expect(result.current.cards).toEqual(initialCards);
  });
});
