import React, { memo, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../domain/entities';
import { CardItem } from './CardItem';

interface CardsListProps {
  cards: Card[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onShowSecureData: (cardId: string) => void;
  isLoadingCard: (cardId: string) => boolean;
}

export const CardsList = memo<CardsListProps>(
  ({ cards, loading, error, onRefresh, onShowSecureData, isLoadingCard }) => {
      const renderCard = useCallback(
    ({ item }: { item: Card }) => (
      <CardItem
        card={item}
        onShowSecureData={onShowSecureData}
        loading={isLoadingCard(item.cardId)}
        testID="card-item"
      />
    ),
    [onShowSecureData, isLoadingCard]
  );

    const keyExtractor = useCallback((item: Card) => item.cardId, []);

    const renderEmpty = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tarjetas disponibles</Text>
        </View>
      ),
      []
    );

    const renderError = useCallback(
      () => (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ),
      [error]
    );

      if (loading && cards.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" testID="activity-indicator" />
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
        keyExtractor={keyExtractor}
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
        testID="cards-flatlist"
      />
      </View>
    );
  }
);

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
