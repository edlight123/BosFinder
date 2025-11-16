/**
 * My Job Requests Screen
 * Client views their posted job requests
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
import { JobRequestCard, PrimaryButton } from '../../components';
import { getJobRequestsByClient } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobRequest } from '../../types';
import { ClientStackParamList } from '../../navigation/types';

type MyRequestsScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, 'MyRequests'>;
};

export const MyRequestsScreen: React.FC<MyRequestsScreenProps> = ({ navigation }) => {
  const { firebaseUser } = useAuth();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    if (!firebaseUser) return;

    try {
      const data = await getJobRequestsByClient(firebaseUser.uid);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
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
        <Text style={styles.title}>My Job Requests</Text>
        <PrimaryButton
          title="+ New Request"
          onPress={() => navigation.navigate('JobRequestCreate')}
          style={styles.newButton}
        />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobRequestCard
            jobRequest={item}
            onPress={() => {}}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No job requests yet</Text>
            <Text style={styles.emptySubtext}>
              Post a job request to connect with skilled Bòs
            </Text>
            <PrimaryButton
              title="Post First Request"
              onPress={() => navigation.navigate('JobRequestCreate')}
              style={styles.emptyButton}
            />
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  newButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});
