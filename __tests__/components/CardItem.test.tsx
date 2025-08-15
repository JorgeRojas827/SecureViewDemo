import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CardItem } from '../../src/capabilities/card-management/presentation/components/CardItem';
import { Card } from '../../src/capabilities/card-management/domain/entities';

const mockCard: Card = {
  cardId: 'card-001',
  alias: 'Tarjeta Principal',
  brand: 'VISA',
  maskedPan: '**** **** **** 1234',
  holder: 'Juan Pérez',
  expiry: '12/25',
  accountId: 'account-001',
  cardType: 'DEBIT',
};

const mockOnShowSecureData = jest.fn();

describe('CardItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card information correctly', () => {
    const { getByText } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    expect(getByText('Tarjeta Principal')).toBeTruthy();
    expect(getByText('VISA')).toBeTruthy();
    expect(getByText('**** **** **** 1234')).toBeTruthy();
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('12/25')).toBeTruthy();
    expect(getByText('Ver datos sensibles')).toBeTruthy();
  });

  it('calls onShowSecureData when button is pressed', () => {
    const { getByText } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const button = getByText('Ver datos sensibles');
    fireEvent.press(button);

    expect(mockOnShowSecureData).toHaveBeenCalledWith('card-001');
    expect(mockOnShowSecureData).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading is true', () => {
    const { getByTestId, queryByText } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={true}
      />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
    expect(queryByText('Ver datos sensibles')).toBeNull();
  });

  it('disables button when loading is true', () => {
    const { getByTestId } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={true}
      />
    );

    const button = getByTestId('secure-data-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('does not call onShowSecureData when loading is true', () => {
    const { getByTestId } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={true}
      />
    );

    const button = getByTestId('secure-data-button');
    fireEvent.press(button);

    expect(mockOnShowSecureData).not.toHaveBeenCalled();
  });

  it('applies correct brand colors for different card brands', () => {
    const visaCard = { ...mockCard, brand: 'VISA' as const };
    const mastercardCard = { ...mockCard, brand: 'MASTERCARD' as const };
    const amexCard = { ...mockCard, brand: 'AMEX' as const };
    const unknownCard = { ...mockCard, brand: 'UNKNOWN' as any };

    const { rerender, getByText } = render(
      <CardItem
        card={visaCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const visaBrand = getByText('VISA');
    expect(visaBrand.props.style[1].color).toBe('#1A1F71');

    rerender(
      <CardItem
        card={mastercardCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const mastercardBrand = getByText('MASTERCARD');
    expect(mastercardBrand.props.style[1].color).toBe('#EB001B');

    rerender(
      <CardItem
        card={amexCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const amexBrand = getByText('AMEX');
    expect(amexBrand.props.style[1].color).toBe('#006FCF');

    rerender(
      <CardItem
        card={unknownCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const unknownBrand = getByText('UNKNOWN');
    expect(unknownBrand.props.style[1].color).toBe('#333');
  });

  it('has correct accessibility props', () => {
    const { getByTestId } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    const button = getByTestId('secure-data-button');
    expect(button.props.accessibilityLabel).toBe('Ver datos sensibles de Tarjeta Principal');
    expect(button.props.accessibilityHint).toBe('Abre una vista segura con los datos completos de la tarjeta');
  });

  it('applies disabled styles when loading', () => {
    const { getByTestId } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={true}
      />
    );

    const button = getByTestId('secure-data-button');
    expect(button.props.style).toMatchObject({ backgroundColor: '#CCCCCC' });
  });

  it('handles long card aliases correctly', () => {
    const longAliasCard = {
      ...mockCard,
      alias: 'Esta es una tarjeta con un nombre muy largo que debería manejarse correctamente',
    };

    const { getByText } = render(
      <CardItem
        card={longAliasCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    expect(getByText(longAliasCard.alias)).toBeTruthy();
  });

  it('renders all card fields correctly', () => {
    const { getByText } = render(
      <CardItem
        card={mockCard}
        onShowSecureData={mockOnShowSecureData}
        loading={false}
      />
    );

    expect(getByText('Titular')).toBeTruthy();
    expect(getByText('Vence')).toBeTruthy();
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('12/25')).toBeTruthy();
  });
});
