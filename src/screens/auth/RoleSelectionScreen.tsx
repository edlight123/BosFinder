/**
 * Role Selection Screen
 * User chooses between Client or Bòs role after signup
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import { UserRole } from '../../types';

type RoleSelectionScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'RoleSelection'>;
};

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  navigation,
}) => {
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Select a role', 'Please choose how you want to use BòsFinder');
      return;
    }

    setLoading(true);

    try {
      await setUserRole(selectedRole);
      // Navigation will be handled by auth state change
      
      // If Bòs, they'll need to create their profile next
      // This will be handled in the navigation logic
    } catch (error) {
      console.error('Error setting role:', error);
      Alert.alert('Error', 'Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How do you want to use BòsFinder?</Text>
        <Text style={styles.subtitle}>
          You can always change this later in your profile settings
        </Text>

        <View style={styles.rolesContainer}>
          {/* Client Role */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'client' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('client')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <Text style={styles.roleIcon}>👤</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Client</Text>
            <Text style={styles.roleDescription}>
              I'm looking for skilled workers (plumbers, electricians, etc.)
            </Text>
            {selectedRole === 'client' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Bòs Role */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'bos' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('bos')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <Text style={styles.roleIcon}>🔧</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Bòs (Professional)</Text>
            <Text style={styles.roleDescription}>
              I offer professional services and want to connect with clients
            </Text>
            {selectedRole === 'bos' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={!selectedRole}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  rolesContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roleIconContainer: {
    marginBottom: 16,
  },
  roleIcon: {
    fontSize: 60,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
