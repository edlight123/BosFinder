/**
 * Job Request Detail Screen (for Bòs)
 * View job details and unlock client contact
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { PrimaryButton } from '../../components';
import { 
  getJobRequestById, 
  getOrCreateLead, 
  unlockClientContact 
} from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobRequest, Lead } from '../../types';
import { BosStackParamList } from '../../navigation/types';

type JobRequestDetailScreenProps = {
  navigation: NativeStackNavigationProp<BosStackParamList, 'JobRequestDetail'>;
  route: RouteProp<BosStackParamList, 'JobRequestDetail'>;
};

export const JobRequestDetailScreen: React.FC<JobRequestDetailScreenProps> = ({ route }) => {
  const { jobRequestId } = route.params;
  const { firebaseUser, bosProfile, refreshBosProfile } = useAuth();
  
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    loadJobRequest();
  }, [jobRequestId]);

  const loadJobRequest = async () => {
    if (!firebaseUser) return;

    try {
      const [jobData, leadData] = await Promise.all([
        getJobRequestById(jobRequestId),
        getOrCreateLead(jobRequestId, firebaseUser.uid),
      ]);
      
      setJobRequest(jobData);
      setLead(leadData);
    } catch (error) {
      console.error('Error loading job request:', error);
      Alert.alert('Error', 'Failed to load job request');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockContact = async () => {
    if (!lead || !bosProfile || !firebaseUser) return;

    if (bosProfile.leadCredits <= 0) {
      Alert.alert(
        'Insufficient Credits',
        'You need lead credits to unlock client contact information. Please contact support to purchase more credits.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Unlock Contact',
      `This will use 1 lead credit. You have ${bosProfile.leadCredits} credits remaining. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            setUnlocking(true);
            try {
              const result = await unlockClientContact(lead.id, firebaseUser.uid);
              
              if (result.success) {
                // Refresh data
                await Promise.all([
                  refreshBosProfile(),
                  loadJobRequest(),
                ]);
                
                Alert.alert('Success', 'Client contact unlocked! You can now see their phone number.');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error unlocking contact:', error);
              Alert.alert('Error', 'Failed to unlock contact');
            } finally {
              setUnlocking(false);
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (jobRequest?.clientPhone) {
      Linking.openURL(`tel:${jobRequest.clientPhone}`);
    }
  };

  const handleWhatsApp = () => {
    if (jobRequest?.clientPhone) {
      const message = encodeURIComponent(`Hi ${jobRequest.clientName}, I saw your job request on BòsFinder: "${jobRequest.title}". I'd like to help!`);
      Linking.openURL(`whatsapp://send?phone=${jobRequest.clientPhone}&text=${message}`);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!jobRequest || !lead) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Job request not found</Text>
      </View>
    );
  }

  const isContactUnlocked = lead.hasUnlockedContact;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{jobRequest.category}</Text>
        </View>
        <Text style={styles.title}>{jobRequest.title}</Text>
        <Text style={styles.location}>
          📍 {jobRequest.commune}, {jobRequest.city}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>{jobRequest.description}</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        
        {jobRequest.preferredDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Preferred Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(jobRequest.preferredDate)}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📝 Status</Text>
          <Text style={styles.detailValue}>{jobRequest.status}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕒 Posted</Text>
          <Text style={styles.detailValue}>
            {formatDate(jobRequest.createdAt)}
          </Text>
        </View>
      </View>

      {/* Client Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        
        {isContactUnlocked ? (
          <>
            <View style={styles.unlockedInfo}>
              <Text style={styles.unlockSuccessText}>✓ Contact Unlocked</Text>
              <Text style={styles.clientName}>{jobRequest.clientName}</Text>
              <Text style={styles.clientPhone}>📱 {jobRequest.clientPhone}</Text>
            </View>

            <PrimaryButton
              title="Call Client"
              onPress={handleCall}
              style={styles.button}
            />

            <PrimaryButton
              title="Message on WhatsApp"
              onPress={handleWhatsApp}
              variant="secondary"
              style={styles.button}
            />
          </>
        ) : (
          <>
            <View style={styles.lockedInfo}>
              <Text style={styles.lockedIcon}>🔒</Text>
              <Text style={styles.lockedText}>
                Unlock client contact to see phone number and reach out directly
              </Text>
              <View style={styles.creditInfo}>
                <Text style={styles.creditText}>
                  Cost: 1 credit
                </Text>
                <Text style={styles.creditText}>
                  You have: {bosProfile?.leadCredits || 0} credits
                </Text>
              </View>
            </View>

            <PrimaryButton
              title="Unlock Contact (1 Credit)"
              onPress={handleUnlockContact}
              loading={unlocking}
              disabled={!bosProfile || bosProfile.leadCredits <= 0}
              style={styles.button}
            />

            {bosProfile && bosProfile.leadCredits <= 0 && (
              <Text style={styles.noCreditsText}>
                ⚠️ You don't have enough credits. Contact support to purchase more.
              </Text>
            )}
          </>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  location: {
    fontSize: 15,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  unlockedInfo: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  unlockSuccessText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  clientPhone: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  lockedInfo: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  lockedIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  creditInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  creditText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  button: {
    marginBottom: 12,
  },
  noCreditsText: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 24,
  },
});
