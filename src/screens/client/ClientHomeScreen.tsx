/**
 * Client Home Screen
 * Browse and search for Bòs profiles
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BosCard, TextInputField } from '../../components';
import { searchBosProfiles } from '../../services/firebase';
import { BosProfile } from '../../types';
import { ClientStackParamList } from '../../navigation/types';

type ClientHomeScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, 'ClientHome'>;
};

export const ClientHomeScreen: React.FC<ClientHomeScreenProps> = ({ navigation }) => {
  const [bosProfiles, setBosProfiles] = useState<BosProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBosProfiles();
  }, []);

  const loadBosProfiles = async () => {
    try {
      const profiles = await searchBosProfiles();
      setBosProfiles(profiles);
    } catch (error) {
      console.error('Error loading Bòs profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBosProfiles();
    setRefreshing(false);
  };

  const filteredProfiles = bosProfiles.filter(profile =>
    profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
    profile.commune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBosPress = (bosProfile: BosProfile) => {
    navigation.navigate('BosProfile', { bosId: bosProfile.id });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Bòs</Text>
        <Text style={styles.subtitle}>Connect with skilled professionals</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInputField
          placeholder="Search by name, category, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BosCard
            bosProfile={item}
            onPress={() => handleBosPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Bòs profiles found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or check back later
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
