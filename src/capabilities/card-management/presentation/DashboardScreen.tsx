import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useCards } from './hooks';
import { useSecureCardView } from './hooks';
import { CardsList } from './components';

export const DashboardScreen: React.FC = () => {
  const { cards, loading, error, refetch } = useCards();
  const { showSecureCard, loading: secureViewLoading, error: secureViewError } = useSecureCardView();

  const handleShowSecureData = async (cardId: string) => {
    await showSecureCard(cardId);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        secureViewLoading={secureViewLoading}
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});