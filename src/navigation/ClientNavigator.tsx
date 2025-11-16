/**
 * Client Navigator with Bottom Tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientStackParamList } from './types';
import {
  ClientHomeScreen,
  BosProfileScreen,
  MyRequestsScreen,
  JobRequestCreateScreen,
} from '../screens/client';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<ClientStackParamList>();

// Home Stack (includes BosProfile as a detail screen)
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ClientHome" 
        component={ClientHomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BosProfile" 
        component={BosProfileScreen}
        options={{ 
          title: 'Bòs Profile',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Requests Stack (includes create screen)
const RequestsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyRequests" 
        component={MyRequestsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="JobRequestCreate" 
        component={JobRequestCreateScreen}
        options={{ 
          title: 'New Request',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export const ClientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Find Bòs',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🔍</span>,
        }}
      />
      <Tab.Screen 
        name="Requests" 
        component={RequestsStack}
        options={{
          tabBarLabel: 'My Requests',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📋</span>,
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
