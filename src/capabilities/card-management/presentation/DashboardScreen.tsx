import React, { useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useCards } from './hooks';
import { useSecureCardView } from './hooks';
import { CardsList } from './components';

export const DashboardScreen: React.FC = () => {
  const { cards, loading, error, refetch } = useCards();
  const {
    showSecureCard,
    error: secureViewError,
    isLoadingCard,
  } = useSecureCardView();

  const handleShowSecureData = useCallback(
    async (cardId: string) => {
      await showSecureCard(cardId);
    },
    [showSecureCard]
  );

    return (
    <SafeAreaView style={styles.container} testID="dashboard-screen">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tarjetas</Text>
        <Text style={styles.subtitle}>
          Gestiona tus tarjetas de forma segura
        </Text>
      </View>

      <CardsList
        cards={cards}
        loading={loading}
        error={error || secureViewError}
        onRefresh={refetch}
        onShowSecureData={handleShowSecureData}
        isLoadingCard={isLoadingCard}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
});
