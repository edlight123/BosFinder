/**
 * Firebase configuration and initialization
 * 
 * IMPORTANT: Replace these values with your actual Firebase project config
 * Get this from: Firebase Console > Project Settings > Your apps > SDK setup and configuration
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  RecaptchaVerifier,
  PhoneAuthProvider,
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { User, BosProfile, JobRequest, Lead, Review, UserRole } from '../types';

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage (for profile photos, etc.)
const storage = getStorage(app);

// Export Firebase services
export { auth, db, storage };

// ===========================
// Collection References
// ===========================

export const usersCollection = collection(db, 'users');
export const bosProfilesCollection = collection(db, 'bosProfiles');
export const jobRequestsCollection = collection(db, 'jobRequests');
export const leadsCollection = collection(db, 'leads');
export const reviewsCollection = collection(db, 'reviews');

// ===========================
// Helper Functions: Auth
// ===========================

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

/**
 * Get current Firebase user
 */
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// ===========================
// Helper Functions: Users
// ===========================

/**
 * Create a new user document in Firestore
 */
export const createUser = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const userDoc = {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(doc(usersCollection, userId), userDoc);
};

/**
 * Get user document from Firestore
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(usersCollection, userId));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    id: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as User;
};

/**
 * Update user document
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  await updateDoc(doc(usersCollection, userId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// ===========================
// Helper Functions: Bòs Profiles
// ===========================

/**
 * Create a new Bòs profile
 */
export const createBosProfile = async (
  bosId: string, 
  profileData: Omit<BosProfile, 'id' | 'createdAt' | 'updatedAt' | 'ratingAverage' | 'ratingCount' | 'leadCredits' | 'isVerified'>
): Promise<void> => {
  const profileDoc = {
    ...profileData,
    ratingAverage: 0,
    ratingCount: 0,
    leadCredits: 5, // Give 5 free credits to start
    isVerified: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(doc(bosProfilesCollection, bosId), profileDoc);
};

/**
 * Get Bòs profile by ID
 */
export const getBosProfileById = async (bosId: string): Promise<BosProfile | null> => {
  const profileDoc = await getDoc(doc(bosProfilesCollection, bosId));
  if (!profileDoc.exists()) return null;
  
  const data = profileDoc.data();
  return {
    id: profileDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as BosProfile;
};

/**
 * Update Bòs profile
 */
export const updateBosProfile = async (bosId: string, updates: Partial<BosProfile>): Promise<void> => {
  await updateDoc(doc(bosProfilesCollection, bosId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Search/filter Bòs profiles
 */
export const searchBosProfiles = async (
  filters: {
    category?: string;
    commune?: string;
    minRating?: number;
  } = {}
): Promise<BosProfile[]> => {
  const constraints: QueryConstraint[] = [];
  
  if (filters.category) {
    constraints.push(where('categories', 'array-contains', filters.category));
  }
  
  if (filters.commune) {
    constraints.push(where('commune', '==', filters.commune));
  }
  
  if (filters.minRating) {
    constraints.push(where('ratingAverage', '>=', filters.minRating));
  }
  
  constraints.push(orderBy('ratingAverage', 'desc'));
  constraints.push(limit(20));
  
  const q = query(bosProfilesCollection, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as BosProfile;
  });
};

// ===========================
// Helper Functions: Job Requests
// ===========================

/**
 * Create a new job request
 */
export const createJobRequest = async (
  requestData: Omit<JobRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  const jobDoc = {
    ...requestData,
    status: 'open',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(jobRequestsCollection, jobDoc);
  return docRef.id;
};

/**
 * Get job request by ID
 */
export const getJobRequestById = async (jobId: string): Promise<JobRequest | null> => {
  const jobDoc = await getDoc(doc(jobRequestsCollection, jobId));
  if (!jobDoc.exists()) return null;
  
  const data = jobDoc.data();
  return {
    id: jobDoc.id,
    ...data,
    preferredDate: data.preferredDate?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as JobRequest;
};

/**
 * Get job requests for a client
 */
export const getJobRequestsByClient = async (clientId: string): Promise<JobRequest[]> => {
  const q = query(
    jobRequestsCollection, 
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      preferredDate: data.preferredDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as JobRequest;
  });
};

/**
 * Get open job requests matching Bòs categories and location
 */
export const getMatchingJobRequests = async (
  categories: string[],
  commune?: string
): Promise<JobRequest[]> => {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'open'),
  ];
  
  // Note: Firestore doesn't support 'in' with 'array-contains'
  // For now, we'll fetch all open jobs and filter client-side
  // In production, consider denormalizing or using Cloud Functions
  
  if (commune) {
    constraints.push(where('commune', '==', commune));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(50));
  
  const q = query(jobRequestsCollection, ...constraints);
  const snapshot = await getDocs(q);
  
  const jobs = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      preferredDate: data.preferredDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as JobRequest;
  });
  
  // Filter by categories client-side
  return jobs.filter(job => categories.includes(job.category));
};

/**
 * Update job request
 */
export const updateJobRequest = async (jobId: string, updates: Partial<JobRequest>): Promise<void> => {
  await updateDoc(doc(jobRequestsCollection, jobId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// ===========================
// Helper Functions: Leads
// ===========================

/**
 * Create or get lead for a Bòs viewing a job request
 */
export const getOrCreateLead = async (jobRequestId: string, bosId: string): Promise<Lead> => {
  // Check if lead already exists
  const q = query(
    leadsCollection,
    where('jobRequestId', '==', jobRequestId),
    where('bosId', '==', bosId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      unlockedAt: data.unlockedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    } as Lead;
  }
  
  // Create new lead
  const leadDoc = {
    jobRequestId,
    bosId,
    hasUnlockedContact: false,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(leadsCollection, leadDoc);
  
  return {
    id: docRef.id,
    ...leadDoc,
    createdAt: leadDoc.createdAt.toDate(),
  } as Lead;
};

/**
 * Unlock client contact (spend lead credit)
 */
export const unlockClientContact = async (
  leadId: string,
  bosId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get current Bòs profile to check credits
    const bosProfile = await getBosProfileById(bosId);
    
    if (!bosProfile) {
      return { success: false, message: 'Profile not found' };
    }
    
    if (bosProfile.leadCredits <= 0) {
      return { success: false, message: 'Insufficient lead credits' };
    }
    
    // Deduct credit
    await updateBosProfile(bosId, {
      leadCredits: bosProfile.leadCredits - 1,
    });
    
    // Mark lead as unlocked
    await updateDoc(doc(leadsCollection, leadId), {
      hasUnlockedContact: true,
      unlockedAt: Timestamp.now(),
    });
    
    return { success: true, message: 'Contact unlocked successfully' };
  } catch (error) {
    console.error('Error unlocking contact:', error);
    return { success: false, message: 'Failed to unlock contact' };
  }
};

/**
 * Get leads for a Bòs
 */
export const getLeadsByBos = async (bosId: string): Promise<Lead[]> => {
  const q = query(
    leadsCollection,
    where('bosId', '==', bosId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      unlockedAt: data.unlockedAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
    } as Lead;
  });
};

// ===========================
// Helper Functions: Reviews (for future)
// ===========================

/**
 * Create a review
 */
export const createReview = async (
  reviewData: Omit<Review, 'id' | 'createdAt'>
): Promise<string> => {
  const reviewDoc = {
    ...reviewData,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(reviewsCollection, reviewDoc);
  
  // Update Bòs rating (should be done in a transaction or Cloud Function in production)
  const bosProfile = await getBosProfileById(reviewData.bosId);
  if (bosProfile) {
    const newRatingCount = bosProfile.ratingCount + 1;
    const newRatingAverage = 
      (bosProfile.ratingAverage * bosProfile.ratingCount + reviewData.rating) / newRatingCount;
    
    await updateBosProfile(reviewData.bosId, {
      ratingAverage: newRatingAverage,
      ratingCount: newRatingCount,
    });
  }
  
  return docRef.id;
};

/**
 * Get reviews for a Bòs
 */
export const getReviewsByBos = async (bosId: string): Promise<Review[]> => {
  const q = query(
    reviewsCollection,
    where('bosId', '==', bosId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
    } as Review;
  });
};
