/**
 * Authentication Context
 * Manages user authentication state and provides auth-related functions
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { User, UserRole, BosProfile } from '../types';
import {
  auth,
  signUpWithEmail,
  signInWithEmail,
  signOut as firebaseSignOut,
  getUserById,
  createUser,
  getBosProfileById,
} from '../services/firebase';

interface AuthContextType {
  // Authentication state
  firebaseUser: FirebaseUser | null;
  user: User | null;
  bosProfile: BosProfile | null;
  loading: boolean;
  
  // Authentication methods
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // User profile methods
  setUserRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshBosProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bosProfile, setBosProfile] = useState<BosProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Listen to Firebase auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user document from Firestore
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setBosProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Load user data from Firestore
   */
  const loadUserData = async (userId: string) => {
    try {
      const userData = await getUserById(userId);
      setUser(userData);
      
      // If user is a Bòs, load their profile
      if (userData?.role === 'bos') {
        const profile = await getBosProfileById(userId);
        setBosProfile(profile);
      } else {
        setBosProfile(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
      setBosProfile(null);
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (
    email: string,
    password: string,
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Create Firebase auth user
      const firebaseUser = await signUpWithEmail(email, password);
      
      // Create user document in Firestore
      await createUser(firebaseUser.uid, userData);
      
      // Reload user data
      await loadUserData(firebaseUser.uid);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  /**
   * Sign in existing user
   */
  const signIn = async (email: string, password: string) => {
    try {
      const firebaseUser = await signInWithEmail(email, password);
      await loadUserData(firebaseUser.uid);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      setBosProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  /**
   * Set user role (called after initial signup)
   */
  const setUserRole = async (role: UserRole) => {
    if (!firebaseUser || !user) {
      throw new Error('No user logged in');
    }

    try {
      await createUser(firebaseUser.uid, {
        ...user,
        role,
      });
      
      await loadUserData(firebaseUser.uid);
    } catch (error) {
      console.error('Error setting user role:', error);
      throw error;
    }
  };

  /**
   * Refresh user data from Firestore
   */
  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserData(firebaseUser.uid);
    }
  };

  /**
   * Refresh Bòs profile data
   */
  const refreshBosProfile = async () => {
    if (firebaseUser && user?.role === 'bos') {
      const profile = await getBosProfileById(firebaseUser.uid);
      setBosProfile(profile);
    }
  };

  const value: AuthContextType = {
    firebaseUser,
    user,
    bosProfile,
    loading,
    signUp,
    signIn,
    signOut,
    setUserRole,
    refreshUser,
    refreshBosProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
