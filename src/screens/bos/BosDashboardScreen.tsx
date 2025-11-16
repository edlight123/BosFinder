/**
 * Bòs Dashboard Screen
 * Overview of Bòs metrics and stats
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { PrimaryButton } from '../../components';
import { BosStackParamList } from '../../navigation/types';

type BosDashboardScreenProps = {
  navigation: NativeStackNavigationProp<BosStackParamList, 'BosDashboard'>;
};

export const BosDashboardScreen: React.FC<BosDashboardScreenProps> = ({ navigation }) => {
  const { bosProfile, user } = useAuth();

  const renderStatCard = (label: string, value: string | number, icon: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (!bosProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.setupContainer}>
          <Text style={styles.setupIcon}>🔧</Text>
          <Text style={styles.setupTitle}>Complete Your Profile</Text>
          <Text style={styles.setupText}>
            Set up your professional profile to start receiving job requests
          </Text>
          <PrimaryButton
            title="Create Profile"
            onPress={() => navigation.navigate('BosProfileEdit')}
            style={styles.setupButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.nameText}>{bosProfile.displayName}!</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {renderStatCard('Lead Credits', bosProfile.leadCredits, '💳')}
        {renderStatCard('Rating', bosProfile.ratingAverage.toFixed(1), '⭐')}
        {renderStatCard('Reviews', bosProfile.ratingCount, '💬')}
        {renderStatCard('Experience', `${bosProfile.yearsOfExperience}+ yrs`, '📅')}
      </View>

      {/* Profile Status */}
      <View style={styles.profileStatus}>
        <View style={styles.statusHeader}>
          <Text style={styles.sectionTitle}>Profile Status</Text>
          {bosProfile.isVerified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          ) : (
            <View style={styles.unverifiedBadge}>
              <Text style={styles.unverifiedText}>Not Verified</Text>
            </View>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.infoText}>📍 {bosProfile.commune}, {bosProfile.city}</Text>
          <Text style={styles.infoText}>
            🔨 {bosProfile.categories.join(', ')}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('JobRequestsList')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Job Requests</Text>
            <Text style={styles.actionSubtitle}>Browse available jobs in your area</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BosProfileEdit')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionSubtitle}>Update your information and services</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Credits Info */}
      <View style={styles.creditsInfo}>
        <Text style={styles.creditsTitle}>💡 About Lead Credits</Text>
        <Text style={styles.creditsText}>
          Use lead credits to unlock client contact information from job requests. 
          Each unlock costs 1 credit. You currently have <Text style={styles.creditsBold}>
          {bosProfile.leadCredits} credits</Text>.
        </Text>
        {bosProfile.leadCredits < 3 && (
          <Text style={styles.creditsWarning}>
            ⚠️ Running low on credits! Contact support to purchase more.
          </Text>
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
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  setupIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  setupText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  setupButton: {
    minWidth: 200,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  profileStatus: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  unverifiedBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unverifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  profileInfo: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  creditsInfo: {
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  creditsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  creditsText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  creditsBold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  creditsWarning: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 8,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 24,
  },
});
