/**
 * Job Request Card Component
 * Displays a job request in a list view
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JobRequest } from '../types';

interface JobRequestCardProps {
  jobRequest: JobRequest;
  onPress: () => void;
  showClientInfo?: boolean; // For Bòs view
}

export const JobRequestCard: React.FC<JobRequestCardProps> = ({
  jobRequest,
  onPress,
  showClientInfo = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#10B981'; // Green
      case 'in_contact':
        return '#F59E0B'; // Orange
      case 'closed':
        return '#6B7280'; // Gray
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_contact':
        return 'In Contact';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{jobRequest.category}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(jobRequest.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(jobRequest.status)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{jobRequest.title}</Text>
      
      <Text style={styles.description} numberOfLines={2}>
        {jobRequest.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.location}>
          📍 {jobRequest.commune}, {jobRequest.city}
        </Text>
        {jobRequest.preferredDate && (
          <Text style={styles.date}>
            📅 {formatDate(jobRequest.preferredDate)}
          </Text>
        )}
      </View>

      {showClientInfo && jobRequest.clientName && (
        <View style={styles.clientInfo}>
          <Text style={styles.clientLabel}>Client:</Text>
          <Text style={styles.clientName}>{jobRequest.clientName}</Text>
          {jobRequest.clientPhone && (
            <Text style={styles.clientPhone}>📱 {jobRequest.clientPhone}</Text>
          )}
        </View>
      )}

      <Text style={styles.timestamp}>
        Posted {formatDate(jobRequest.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
  },
  clientInfo: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  clientLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
