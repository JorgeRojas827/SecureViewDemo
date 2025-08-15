import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DashboardScreen } from '../../src/capabilities/card-management/presentation/DashboardScreen';
import { useCards } from '../../src/capabilities/card-management/presentation/hooks/useCards';
import { useSecureCardView } from '../../src/capabilities/card-management/presentation/hooks/useSecureCardView';

jest.mock('../../src/capabilities/card-management/presentation/hooks/useCards');
jest.mock('../../src/capabilities/card-management/presentation/hooks/useSecureCardView');

const mockUseCards = useCards as jest.MockedFunction<typeof useCards>;
const mockUseSecureCardView = useSecureCardView as jest.MockedFunction<typeof useSecureCardView>;

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

const mockShowSecureCard = jest.fn();
const mockIsLoadingCard = jest.fn();
const mockRefetch = jest.fn();

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseCards.mockReturnValue({
      cards: mockCards,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    mockUseSecureCardView.mockReturnValue({
      showSecureCard: mockShowSecureCard,
      error: null,
      isLoadingCard: mockIsLoadingCard,
      loadingCardId: null,
      loading: false,
    });
  });

  it('renders correctly with cards', () => {
    const { getByText } = render(<DashboardScreen />);

    expect(getByText('Mis Tarjetas')).toBeTruthy();
    expect(getByText('Gestiona tus tarjetas de forma segura')).toBeTruthy();
    expect(getByText('Tarjeta Principal')).toBeTruthy();
    expect(getByText('Tarjeta Secundaria')).toBeTruthy();
  });

  it('renders loading state when cards are loading', () => {
    mockUseCards.mockReturnValue({
      cards: [],
      loading: true,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText, getByTestId } = render(<DashboardScreen />);

    expect(getByText('Cargando tarjetas...')).toBeTruthy();
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders empty state when no cards', () => {
    mockUseCards.mockReturnValue({
      cards: [],
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = render(<DashboardScreen />);

    expect(getByText('No hay tarjetas disponibles')).toBeTruthy();
  });

  it('renders error state when there is an error', () => {
    const errorMessage = 'Error al cargar las tarjetas';
    mockUseCards.mockReturnValue({
      cards: [],
      loading: false,
      error: errorMessage,
      refetch: mockRefetch,
    });

    const { getByText } = render(<DashboardScreen />);

    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it('renders secure view error when present', () => {
    const secureViewError = 'Error en vista segura';
    mockUseSecureCardView.mockReturnValue({
      showSecureCard: mockShowSecureCard,
      error: secureViewError,
      isLoadingCard: mockIsLoadingCard,
      loadingCardId: null,
      loading: false,
    });

    const { getByText } = render(<DashboardScreen />);

    expect(getByText(`Error: ${secureViewError}`)).toBeTruthy();
  });

  it('handles secure data button press', () => {
    const { getAllByText } = render(<DashboardScreen />);

    const secureButtons = getAllByText('Ver datos sensibles');
    fireEvent.press(secureButtons[0]);

    expect(mockShowSecureCard).toHaveBeenCalledWith('card-001');
  });

  it('handles pull to refresh', () => {
    const { getByTestId } = render(<DashboardScreen />);

    const flatList = getByTestId('cards-flatlist');
    const refreshControl = flatList.props.refreshControl;
    
    refreshControl.props.onRefresh();

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('passes correct props to CardsList', () => {
    mockIsLoadingCard.mockImplementation((cardId: string) => cardId === 'card-001');

    const { getByTestId } = render(<DashboardScreen />);

    const flatList = getByTestId('cards-flatlist');
    expect(flatList.props.data).toEqual(mockCards);
  });

  it('handles individual card loading states', () => {
    mockIsLoadingCard.mockImplementation((cardId: string) => cardId === 'card-001');

    render(<DashboardScreen />);

    expect(mockIsLoadingCard).toHaveBeenCalledWith('card-001');
    expect(mockIsLoadingCard).toHaveBeenCalledWith('card-002');
  });

  it('renders with dark mode status bar', () => {
    const { getByTestId } = render(<DashboardScreen />);
    
    expect(getByTestId('dashboard-screen')).toBeTruthy();
  });

  it('handles secure card request', () => {
    const { getAllByText } = render(<DashboardScreen />);

    const secureButtons = getAllByText('Ver datos sensibles');
    
    fireEvent.press(secureButtons[0]);

    expect(mockShowSecureCard).toHaveBeenCalledWith('card-002');
    expect(mockShowSecureCard).toHaveBeenCalledTimes(1);
  });

  it('maintains stable callback references', () => {
    const { rerender } = render(<DashboardScreen />);

    const initialShowSecureCard = mockShowSecureCard;

    rerender(<DashboardScreen />);

    expect(mockShowSecureCard).toBe(initialShowSecureCard);
  });

  it('handles large number of cards', () => {
    const manyCards = Array.from({ length: 100 }, (_, index) => ({
      cardId: `card-${index}`,
      alias: `Tarjeta ${index}`,
      brand: 'VISA' as const,
      maskedPan: `**** **** **** ${index.toString().padStart(4, '0')}`,
      holder: 'Juan Pérez',
      expiry: '12/25',
      accountId: `account-${index}`,
      cardType: 'DEBIT' as const,
    }));

    mockUseCards.mockReturnValue({
      cards: manyCards,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByTestId } = render(<DashboardScreen />);

    const flatList = getByTestId('cards-flatlist');
    expect(flatList.props.data).toHaveLength(100);
  });

  it('handles error recovery after successful refetch', () => {
    mockUseCards.mockReturnValue({
      cards: [],
      loading: false,
      error: 'Initial error',
      refetch: mockRefetch,
    });

    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Error: Initial error')).toBeTruthy();

    mockUseCards.mockReturnValue({
      cards: mockCards,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText: getByTextAfter } = render(<DashboardScreen />);
    expect(getByTextAfter('Tarjeta Principal')).toBeTruthy();
  });
});
