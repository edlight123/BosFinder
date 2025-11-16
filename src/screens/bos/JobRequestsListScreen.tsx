/**
 * Job Requests List Screen (for Bòs)
 * Browse available job requests matching Bòs profile
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
import { JobRequestCard } from '../../components';
import { getMatchingJobRequests } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobRequest } from '../../types';
import { BosStackParamList } from '../../navigation/types';

type JobRequestsListScreenProps = {
  navigation: NativeStackNavigationProp<BosStackParamList, 'JobRequestsList'>;
};

export const JobRequestsListScreen: React.FC<JobRequestsListScreenProps> = ({ navigation }) => {
  const { bosProfile } = useAuth();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [bosProfile]);

  const loadRequests = async () => {
    if (!bosProfile) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMatchingJobRequests(
        bosProfile.categories,
        bosProfile.commune
      );
      setRequests(data);
    } catch (error) {
      console.error('Error loading job requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleJobPress = (jobRequest: JobRequest) => {
    navigation.navigate('JobRequestDetail', { jobRequestId: jobRequest.id });
  };

  if (!bosProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Please complete your profile first</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Available Jobs</Text>
        <Text style={styles.subtitle}>
          Jobs matching your services in {bosProfile.commune}
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobRequestCard
            jobRequest={item}
            onPress={() => handleJobPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No job requests available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new opportunities in your area
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
  errorText: {
    fontSize: 16,
    color: '#6B7280',
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  },
});
