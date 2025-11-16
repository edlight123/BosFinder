/**
 * Bòs Profile Edit Screen
 * Create or update Bòs professional profile
 */

import React, { useState, useEffect } from 'react';
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
import { createBosProfile, updateBosProfile } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES, COMMUNES } from '../../types';
import { BosStackParamList } from '../../navigation/types';

type BosProfileEditScreenProps = {
  navigation: NativeStackNavigationProp<BosStackParamList, 'BosProfileEdit'>;
};

export const BosProfileEditScreen: React.FC<BosProfileEditScreenProps> = ({ navigation }) => {
  const { bosProfile, firebaseUser, refreshBosProfile } = useAuth();
  const isEditing = !!bosProfile;

  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [commune, setCommune] = useState<string>(COMMUNES[0]);
  const [city, setCity] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [priceRangeMin, setPriceRangeMin] = useState('');
  const [priceRangeMax, setPriceRangeMax] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bosProfile) {
      setDisplayName(bosProfile.displayName);
      setDescription(bosProfile.description);
      setSelectedCategories(bosProfile.categories);
      setCommune(bosProfile.commune);
      setCity(bosProfile.city);
      setYearsOfExperience(bosProfile.yearsOfExperience.toString());
      setPriceRangeMin(bosProfile.priceRangeMin.toString());
      setPriceRangeMax(bosProfile.priceRangeMax.toString());
      setWhatsappNumber(bosProfile.whatsappNumber || '');
    }
  }, [bosProfile]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!displayName.trim()) {
      Alert.alert('Required', 'Please enter your display name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required', 'Please add a description of your services');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one service category');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Required', 'Please enter your city');
      return;
    }

    const experience = parseInt(yearsOfExperience);
    if (isNaN(experience) || experience < 0) {
      Alert.alert('Invalid', 'Please enter valid years of experience');
      return;
    }

    if (!firebaseUser) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        userId: firebaseUser.uid,
        displayName: displayName.trim(),
        description: description.trim(),
        categories: selectedCategories,
        commune,
        city: city.trim(),
        yearsOfExperience: experience,
        priceRangeMin: parseInt(priceRangeMin) || 0,
        priceRangeMax: parseInt(priceRangeMax) || 0,
        whatsappNumber: whatsappNumber.trim() || undefined,
      };

      if (isEditing) {
        await updateBosProfile(firebaseUser.uid, profileData);
        Alert.alert('Success', 'Your profile has been updated!');
      } else {
        await createBosProfile(firebaseUser.uid, profileData);
        Alert.alert('Success', 'Your profile has been created! You can now start receiving job requests.');
      }

      await refreshBosProfile();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
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
          <Text style={styles.title}>
            {isEditing ? 'Edit Your Profile' : 'Create Your Profile'}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing 
              ? 'Update your professional information'
              : 'Set up your professional profile to start receiving job requests'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Display Name *"
            placeholder="Your professional name"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Services You Offer *</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category) && styles.categoryChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInputField
            label="About Your Services *"
            placeholder="Describe your experience and services..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Commune *</Text>
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
            label="City/Neighborhood *"
            placeholder="e.g., Turgeau, Bourdon"
            value={city}
            onChangeText={setCity}
          />

          <TextInputField
            label="Years of Experience *"
            placeholder="e.g., 5"
            value={yearsOfExperience}
            onChangeText={setYearsOfExperience}
            keyboardType="numeric"
          />

          <View style={styles.priceRange}>
            <View style={{ flex: 1 }}>
              <TextInputField
                label="Min Price (HTG)"
                placeholder="500"
                value={priceRangeMin}
                onChangeText={setPriceRangeMin}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <TextInputField
                label="Max Price (HTG)"
                placeholder="2000"
                value={priceRangeMax}
                onChangeText={setPriceRangeMax}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TextInputField
            label="WhatsApp Number"
            placeholder="+509 XXXX XXXX"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
          />

          <Text style={styles.infoText}>
            💡 Your WhatsApp number will be shared with clients who unlock your contact from job requests
          </Text>

          <PrimaryButton
            title={isEditing ? 'Update Profile' : 'Create Profile'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Import TouchableOpacity at top
import { TouchableOpacity } from 'react-native';

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
    lineHeight: 20,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 16,
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
  priceRange: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
