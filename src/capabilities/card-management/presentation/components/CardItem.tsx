import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Card } from '../../domain/entities';

interface CardItemProps {
  card: Card;
  onShowSecureData: (cardId: string) => void;
  loading?: boolean;
}

export const CardItem = memo<CardItemProps>(({ card, onShowSecureData, loading }) => {
  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'VISA': return '#1A1F71';
      case 'MASTERCARD': return '#EB001B';
      case 'AMEX': return '#006FCF';
      default: return '#333';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderLeftColor: getBrandColor(card.brand) }]}>
        <View style={styles.header}>
          <Text style={styles.alias}>{card.alias}</Text>
          <Text style={[styles.brand, { color: getBrandColor(card.brand) }]}>
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
          onPress={() => onShowSecureData(card.cardId)}
          disabled={loading}
          accessibilityLabel={`Ver datos sensibles de ${card.alias}`}
          accessibilityHint="Abre una vista segura con los datos completos de la tarjeta"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Ver datos sensibles</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alias: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  maskedPan: {
    fontSize: 20,
    fontFamily: 'monospace',
    color: '#555',
    marginBottom: 16,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#888',
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
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

CardItem.displayName = 'CardItem';