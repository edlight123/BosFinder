# BòsFinder 🔧

A mobile app connecting clients with skilled workers ("bòs": plumbers, electricians, masons, carpenters, etc.) in Haiti.

## Overview

BòsFinder is a React Native app built with Expo that helps Haitian clients find and connect with skilled professionals in their area. The app features two user types:

- **Clients**: Browse and contact skilled workers, post job requests
- **Bòs (Professionals)**: Create professional profiles, receive job requests, connect with clients

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Navigation**: React Navigation
- **State Management**: React Context
- **Platform**: Android (primary), iOS (compatible)

## Features

### For Clients
- Browse Bòs profiles by category and location
- View ratings, experience, and pricing
- Post job requests with detailed descriptions
- Contact Bòs via phone or WhatsApp

### For Bòs (Professionals)
- Create professional profile with services offered
- View job requests matching their categories and location
- Use lead credits to unlock client contact information
- Manage profile and track performance

## Project Structure

```
BosFinder/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BosCard.tsx
│   │   ├── JobRequestCard.tsx
│   │   ├── PrimaryButton.tsx
│   │   └── TextInputField.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/          # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   ├── ClientNavigator.tsx
│   │   ├── BosNavigator.tsx
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── screens/             # App screens
│   │   ├── auth/           # Authentication screens
│   │   ├── client/         # Client flow screens
│   │   ├── bos/            # Bòs flow screens
│   │   └── ProfileScreen.tsx
│   ├── services/            # Backend services
│   │   └── firebase.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (see Firebase Setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BosFinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (IMPORTANT)
   
   Open `src/services/firebase.ts` and replace the placeholder configuration with your Firebase project credentials:

   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

   Get these values from:
   - Firebase Console → Project Settings → Your apps → SDK setup and configuration

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device or emulator**
   - Press `a` for Android
   - Press `i` for iOS (macOS only)
   - Or scan the QR code with the Expo Go app on your phone

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Phone** authentication for Haiti (+509)

### 3. Set up Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose a location close to Haiti (e.g., us-east1)

### 4. Create Firestore Collections

The app will automatically create documents, but you should set up these collections:

- `users` - User accounts
- `bosProfiles` - Professional profiles
- `jobRequests` - Job postings
- `leads` - Lead tracking for contact unlocks
- `reviews` - (Future) Client reviews

### 5. Firestore Security Rules (Production)

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bòs profiles are publicly readable, but only owners can write
    match /bosProfiles/{bosId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == bosId;
    }
    
    // Job requests are readable by authenticated users, writable by owners
    match /jobRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.clientId;
    }
    
    // Leads are private to the Bòs
    match /leads/{leadId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.bosId;
    }
    
    // Reviews are publicly readable
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

## Data Models

### User
```typescript
{
  id: string;
  role: 'client' | 'bos';
  fullName: string;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BosProfile
```typescript
{
  id: string;
  userId: string;
  displayName: string;
  categories: string[];
  description: string;
  commune: string;
  city: string;
  ratingAverage: number;
  ratingCount: number;
  priceRangeMin: number;
  priceRangeMax: number;
  yearsOfExperience: number;
  whatsappNumber?: string;
  leadCredits: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### JobRequest
```typescript
{
  id: string;
  clientId: string;
  clientName?: string;
  clientPhone?: string;
  title: string;
  description: string;
  category: string;
  commune: string;
  city: string;
  preferredDate?: Date;
  status: 'open' | 'in_contact' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
```

## Monetization (MVP Concept)

The app uses a **lead credits** system:

- Bòs professionals receive 5 free credits to start
- Each time a Bòs unlocks a client's contact info from a job request, it costs 1 credit
- Credits are tracked in Firestore (no real payments in MVP)
- Future: Implement payment gateway for purchasing credits or subscription tiers

## Development Notes

### Adding New Features

1. **New Screen**: Add to `src/screens/[auth|client|bos]/`
2. **New Component**: Add to `src/components/`
3. **Navigation**: Update relevant navigator in `src/navigation/`
4. **Types**: Update `src/types/index.ts`
5. **Firebase Functions**: Add to `src/services/firebase.ts`

### Styling

- Uses inline StyleSheet for simplicity
- Color palette:
  - Primary: `#2563EB` (Blue)
  - Secondary: `#10B981` (Green)
  - Gray scale: `#1F2937`, `#6B7280`, `#9CA3AF`, `#D1D5DB`, `#F3F4F6`, `#F9FAFB`

### Testing

1. Create test accounts:
   - Client account: Sign up → Select "I'm a Client"
   - Bòs account: Sign up → Select "I'm a Bòs" → Complete profile

2. Test flows:
   - Client: Browse → View Profile → Create Job Request
   - Bòs: View Jobs → Unlock Contact → Contact Client

## Building for Production

### Android

```bash
# Build APK for Android
expo build:android

# Or with EAS Build (recommended)
npm install -g eas-cli
eas build --platform android
```

### iOS

```bash
# Build for iOS (requires macOS and Apple Developer account)
expo build:ios

# Or with EAS Build
eas build --platform ios
```

## Troubleshooting

### Firebase initialization errors
- Ensure you've replaced the placeholder config in `src/services/firebase.ts`
- Verify your Firebase project settings

### Navigation errors
- Make sure all screen components are properly exported
- Check that navigation types match your routes

### Build errors
- Run `expo doctor` to check for common issues
- Clear cache: `expo start -c`

## Future Enhancements

- [ ] Payment integration for lead credits
- [ ] In-app messaging between clients and Bòs
- [ ] Photo uploads for profiles and job requests
- [ ] Review and rating system
- [ ] Push notifications for new job requests
- [ ] Advanced search and filtering
- [ ] Maps integration for location services
- [ ] Multi-language support (Kreyòl, French, English)
- [ ] Admin dashboard for verification and moderation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Contact

[Add contact information]

---

Made with ❤️ for Haiti 🇭🇹
