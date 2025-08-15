import React, { memo } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Card } from '../../domain/entities';
import { CardItem } from './CardItem';

interface CardsListProps {
  cards: Card[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onShowSecureData: (cardId: string) => void;
  secureViewLoading?: boolean;
}

export const CardsList = memo<CardsListProps>(({
  cards,
  loading,
  error,
  onRefresh,
  onShowSecureData,
  secureViewLoading
}) => {
  const renderCard = ({ item }: { item: Card }) => (
    <CardItem
      card={item}
      onShowSecureData={onShowSecureData}
      loading={secureViewLoading}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay tarjetas disponibles</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
    </View>
  );

  if (loading && cards.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando tarjetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && renderError()}
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.cardId}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    textAlign: 'center',
  },
});

CardsList.displayName = 'CardsList';