import React from 'react';
import { render } from '@testing-library/react-native';
import { CardsList } from '../../src/capabilities/card-management/presentation/components/CardsList';
import { Card } from '../../src/capabilities/card-management/domain/entities';

const mockCards: Card[] = [
  {
    cardId: 'card-001',
    alias: 'Tarjeta Principal',
    brand: 'VISA',
    maskedPan: '**** **** **** 1234',
    holder: 'Juan Pérez',
    expiry: '12/25',
    accountId: 'account-001',
    cardType: 'DEBIT',
  },
  {
    cardId: 'card-002',
    alias: 'Tarjeta Secundaria',
    brand: 'MASTERCARD',
    maskedPan: '**** **** **** 5678',
    holder: 'Juan Pérez',
    expiry: '06/26',
    accountId: 'account-002',
    cardType: 'DEBIT',
  },
];

const mockOnShowSecureData = jest.fn();
const mockOnRefresh = jest.fn();
const mockIsLoadingCard = jest.fn();

describe('CardsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cards correctly', () => {
    const { getByText } = render(
      <CardsList
        cards={mockCards}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(getByText('Tarjeta Principal')).toBeTruthy();
    expect(getByText('Tarjeta Secundaria')).toBeTruthy();
    expect(getByText('**** **** **** 1234')).toBeTruthy();
    expect(getByText('**** **** **** 5678')).toBeTruthy();
  });

  it('shows loading state when loading and no cards', () => {
    const { getByText, getByTestId } = render(
      <CardsList
        cards={[]}
        loading={true}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
    expect(getByText('Cargando tarjetas...')).toBeTruthy();
  });

  it('shows empty state when no cards and not loading', () => {
    const { getByText } = render(
      <CardsList
        cards={[]}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(getByText('No hay tarjetas disponibles')).toBeTruthy();
  });

  it('shows error state when error is present', () => {
    const errorMessage = 'Error al cargar las tarjetas';
    const { getByText } = render(
      <CardsList
        cards={mockCards}
        loading={false}
        error={errorMessage}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it('handles individual card loading states', () => {
    mockIsLoadingCard.mockImplementation((cardId: string) => cardId === 'card-001');

    render(
      <CardsList
        cards={mockCards}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(mockIsLoadingCard).toHaveBeenCalledWith('card-001');
    expect(mockIsLoadingCard).toHaveBeenCalledWith('card-002');
  });

  it('renders FlatList with correct props', () => {
    const { getByTestId } = render(
      <CardsList
        cards={mockCards}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    const flatList = getByTestId('cards-flatlist');
    expect(flatList.props.data).toEqual(mockCards);
    expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
  });

  it('handles large number of cards efficiently', () => {
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

    const { getByTestId } = render(
      <CardsList
        cards={manyCards}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    const flatList = getByTestId('cards-flatlist');
    expect(flatList.props.data).toHaveLength(100);
  });

  it('does not show loading state when loading but cards exist', () => {
    const { queryByText } = render(
      <CardsList
        cards={mockCards}
        loading={true}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    expect(queryByText('Cargando tarjetas...')).toBeNull();
  });

  it('handles refresh control correctly', () => {
    const { getByTestId } = render(
      <CardsList
        cards={mockCards}
        loading={true}
        error={null}
        onRefresh={mockOnRefresh}
        onShowSecureData={mockOnShowSecureData}
        isLoadingCard={mockIsLoadingCard}
      />
    );

    const flatList = getByTestId('cards-flatlist');
    const refreshControl = flatList.props.refreshControl;
    
    expect(refreshControl.props.refreshing).toBe(true);
    expect(refreshControl.props.colors).toEqual(['#007AFF']);
    expect(refreshControl.props.tintColor).toBe('#007AFF');
  });
});
