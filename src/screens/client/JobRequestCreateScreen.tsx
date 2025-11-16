/**
 * Job Request Create Screen
 * Client creates a new job request
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { PrimaryButton, TextInputField } from '../../components';
import { createJobRequest } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES, COMMUNES } from '../../types';
import { ClientStackParamList } from '../../navigation/types';

type JobRequestCreateScreenProps = {
  navigation: NativeStackNavigationProp<ClientStackParamList, 'JobRequestCreate'>;
};

export const JobRequestCreateScreen: React.FC<JobRequestCreateScreenProps> = ({
  navigation,
}) => {
  const { user, firebaseUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [commune, setCommune] = useState<string>(COMMUNES[0]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a job title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required', 'Please describe the job');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Required', 'Please enter a city');
      return;
    }

    if (!firebaseUser || !user) {
      Alert.alert('Error', 'You must be logged in to create a job request');
      return;
    }

    setLoading(true);

    try {
      await createJobRequest({
        clientId: firebaseUser.uid,
        clientName: user.fullName,
        title: title.trim(),
        description: description.trim(),
        category,
        commune,
        city: city.trim(),
      });

      Alert.alert(
        'Success',
        'Your job request has been posted! Bòs in your area will be able to see it.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating job request:', error);
      Alert.alert('Error', 'Failed to create job request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Post a Job Request</Text>
          <Text style={styles.subtitle}>
            Describe what you need and connect with skilled Bòs
          </Text>
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Job Title"
            placeholder="e.g., Fix broken sink"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(value) => setCategory(value)}
                style={styles.picker}
              >
                {CATEGORIES.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          <TextInputField
            label="Description"
            placeholder="Describe the work needed in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Commune</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={commune}
                onValueChange={(value) => setCommune(value)}
                style={styles.picker}
              >
                {COMMUNES.map((com) => (
                  <Picker.Item key={com} label={com} value={com} />
                ))}
              </Picker>
            </View>
          </View>

          <TextInputField
            label="City/Neighborhood"
            placeholder="e.g., Turgeau, Bourdon"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.infoText}>
            💡 Tip: Be specific about the problem and location to get better responses
          </Text>

          <PrimaryButton
            title="Post Job Request"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    padding: 20,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: 8,
  },
});
