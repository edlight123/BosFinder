/**
 * Bòs Profile Screen
 * Detailed view of a Bòs profile with contact options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { PrimaryButton } from '../../components';
import { getBosProfileById } from '../../services/firebase';
import { BosProfile } from '../../types';
import { ClientStackParamList } from '../../navigation/types';

type BosProfileScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, 'BosProfile'>;
  route: RouteProp<ClientStackParamList, 'BosProfile'>;
};

export const BosProfileScreen: React.FC<BosProfileScreenProps> = ({ route }) => {
  const { bosId } = route.params;
  const [profile, setProfile] = useState<BosProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [bosId]);

  const loadProfile = async () => {
    try {
      const data = await getBosProfileById(bosId);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (profile?.whatsappNumber) {
      Linking.openURL(`tel:${profile.whatsappNumber}`);
    }
  };

  const handleWhatsApp = () => {
    if (profile?.whatsappNumber) {
      const message = encodeURIComponent(`Hi ${profile.displayName}, I found you on BòsFinder and would like to discuss a job.`);
      Linking.openURL(`whatsapp://send?phone=${profile.whatsappNumber}&text=${message}`);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < fullStars ? '★' : '☆'}
        </Text>
      );
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profile.displayName}</Text>
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingContainer}>
          {renderStars(profile.ratingAverage)}
          <Text style={styles.ratingText}>
            {profile.ratingAverage.toFixed(1)} ({profile.ratingCount} reviews)
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.categoriesContainer}>
          {profile.categories.map((category, index) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{profile.description}</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍 Location</Text>
          <Text style={styles.detailValue}>
            {profile.commune}, {profile.city}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>💼 Experience</Text>
          <Text style={styles.detailValue}>
            {profile.yearsOfExperience}+ years
          </Text>
        </View>

        {profile.priceRangeMin > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Price Range</Text>
            <Text style={styles.detailValue}>
              {profile.priceRangeMin} - {profile.priceRangeMax} HTG
            </Text>
          </View>
        )}
      </View>

      {/* Contact Buttons */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contact {profile.displayName}</Text>
        
        {profile.whatsappNumber ? (
          <>
            <PrimaryButton
              title="Call Now"
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
          <Text style={styles.noContactText}>
            Contact information not available
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    color: '#FBBF24',
    fontSize: 20,
  },
  ratingText: {
    fontSize: 14,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
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
  contactSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  button: {
    marginBottom: 12,
  },
  noContactText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 24,
  },
});
