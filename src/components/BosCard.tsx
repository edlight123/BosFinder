/**
 * Bòs Card Component
 * Displays a Bòs profile in a list view
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BosProfile } from '../types';

interface BosCardProps {
  bosProfile: BosProfile;
  onPress: () => void;
}

export const BosCard: React.FC<BosCardProps> = ({ bosProfile, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {bosProfile.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{bosProfile.displayName}</Text>
            {bosProfile.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          
          <View style={styles.ratingRow}>
            {renderStars(bosProfile.ratingAverage)}
            <Text style={styles.ratingText}>
              {bosProfile.ratingAverage.toFixed(1)} ({bosProfile.ratingCount})
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.categories}>
        {bosProfile.categories.slice(0, 3).map((category, index) => (
          <View key={index} style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
        {bosProfile.categories.length > 3 && (
          <Text style={styles.moreCategories}>
            +{bosProfile.categories.length - 3}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.location}>
          📍 {bosProfile.commune}, {bosProfile.city}
        </Text>
        <Text style={styles.experience}>
          {bosProfile.yearsOfExperience}+ years
        </Text>
      </View>

      {bosProfile.priceRangeMin > 0 && (
        <Text style={styles.priceRange}>
          {bosProfile.priceRangeMin} - {bosProfile.priceRangeMax} HTG
        </Text>
      )}
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
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    color: '#FBBF24',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  moreCategories: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'center',
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
  experience: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceRange: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});
