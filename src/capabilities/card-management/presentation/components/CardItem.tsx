import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../domain/entities';

interface CardItemProps {
  card: Card;
  onShowSecureData: (cardId: string) => void;
  loading?: boolean;
  testID?: string;
}

const BRAND_COLORS = {
  VISA: '#1A1F71',
  MASTERCARD: '#EB001B',
  AMEX: '#006FCF',
} as const;

export const CardItem = memo<CardItemProps>(
  ({ card, onShowSecureData, loading, testID }) => {
    const brandColor =
      BRAND_COLORS[card.brand as keyof typeof BRAND_COLORS] || '#333';

    const handlePress = () => {
      if (!loading) {
        onShowSecureData(card.cardId);
      }
    };

      return (
    <View style={styles.container} testID={testID}>
        <View style={[styles.card, { borderLeftColor: brandColor }]}>
          <View style={styles.header}>
            <Text style={styles.alias}>{card.alias}</Text>
            <Text style={[styles.brand, { color: brandColor }]}>
              {card.brand}
            </Text>
          </View>

          <Text style={styles.maskedPan}>{card.maskedPan}</Text>

          <View style={styles.footer}>
            <View>
              <Text style={styles.label}>Titular</Text>
              <Text style={styles.holder}>{card.holder}</Text>
            </View>

            <View>
              <Text style={styles.label}>Vence</Text>
              <Text style={styles.expiry}>{card.expiry}</Text>
            </View>
          </View>

                  <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePress}
          disabled={loading}
          accessibilityLabel={`Ver datos sensibles de ${card.alias}`}
          accessibilityHint="Abre una vista segura con los datos completos de la tarjeta"
          testID="secure-data-button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" testID="activity-indicator" />
          ) : (
            <Text style={styles.buttonText}>Ver datos sensibles</Text>
          )}
        </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alias: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  brand: {
    fontSize: 14,
    fontWeight: '500',
  },
  maskedPan: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  holder: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  expiry: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

CardItem.displayName = 'CardItem';
