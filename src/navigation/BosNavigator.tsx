/**
 * Bòs Navigator with Bottom Tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BosStackParamList } from './types';
import {
  BosDashboardScreen,
  BosProfileEditScreen,
  JobRequestsListScreen,
  JobRequestDetailScreen,
} from '../screens/bos';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<BosStackParamList>();

// Dashboard Stack
const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BosDashboard" 
        component={BosDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BosProfileEdit" 
        component={BosProfileEditScreen}
        options={{ 
          title: 'Edit Profile',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Jobs Stack
const JobsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JobRequestsList" 
        component={JobRequestsListScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="JobRequestDetail" 
        component={JobRequestDetailScreen}
        options={{ 
          title: 'Job Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export const BosNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📊</span>,
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsStack}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>💼</span>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👤</span>,
          headerShown: true,
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};
