/**
 * Welcome Screen
 * First screen users see - option to sign in or sign up
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../../components';
import { AuthStackParamList } from '../../navigation/types';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔧</Text>
          <Text style={styles.appName}>BòsFinder</Text>
          <Text style={styles.tagline}>
            Connect with skilled workers in Haiti
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Find trusted plumbers, electricians, masons, carpenters, and more.
          </Text>
          <Text style={styles.description}>
            Or offer your professional services to clients in your area.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Sign In / Sign Up"
            onPress={() => navigation.navigate('Login')}
          />
          
          <Text style={styles.helpText}>
            New to BòsFinder? Create an account to get started.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Made with ❤️ for Haiti
      </Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 48,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  helpText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingBottom: 24,
  },
});
