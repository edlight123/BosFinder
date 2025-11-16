# BòsFinder - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### Step 2: Configure Firebase

**IMPORTANT**: You must set up Firebase before the app will work.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Go to Project Settings → Your apps → Add app → Web
4. Copy the configuration object
5. Open `src/services/firebase.ts`
6. Replace the placeholder config (lines 34-40) with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",                    // Replace with your API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

### Step 3: Enable Firebase Services

In Firebase Console:

1. **Authentication**:
   - Click "Get Started"
   - Enable "Email/Password" provider

2. **Firestore Database**:
   - Click "Create database"
   - Start in **test mode** (for development)
   - Choose a location (e.g., us-east1)

### Step 4: Run the App

```bash
npm start
```

Then:
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator (macOS only)
- Or scan QR code with Expo Go app on your phone

### Step 5: Test the App

1. **Create a Client Account**:
   - Click "Sign In / Sign Up"
   - Enter email, password, name, phone
   - Select "I am a Client"

2. **Create a Bòs Account** (use a different email):
   - Sign up again with different email
   - Select "I am a Bòs (Professional)"
   - Complete the profile setup

3. **Test the Flow**:
   - As Client: Browse Bòs → View profile → Create job request
   - As Bòs: View available jobs → Unlock contact (uses 1 credit)

## 📱 Features Overview

### Client Flow
- **Home Tab**: Browse Bòs profiles with search and filters
- **Requests Tab**: View and create job requests
- **Profile Tab**: Manage your account

### Bòs Flow
- **Dashboard Tab**: Overview of credits, rating, and quick actions
- **Jobs Tab**: Browse and unlock job requests
- **Profile Tab**: Manage your account

## 🔧 Common Issues

### Firebase Errors
- **Error**: "Firebase config missing"
  - **Fix**: Update `src/services/firebase.ts` with your config

### Navigation Errors
- **Error**: Screen not found
  - **Fix**: Clear cache with `expo start -c`

### Build Errors
- **Error**: Module not found
  - **Fix**: Run `npm install` and restart

## 📚 Next Steps

1. Customize the app:
   - Update colors in component styles
   - Add your branding to splash screen
   - Customize categories and communes in `src/types/index.ts`

2. Add features:
   - Payment integration for lead credits
   - Photo uploads for profiles
   - In-app messaging
   - Push notifications

3. Deploy:
   - Build for Android: `eas build --platform android`
   - Build for iOS: `eas build --platform ios`

## 🆘 Need Help?

- Check the full [README.md](./README.md) for detailed documentation
- Review code comments in each file
- Check Firebase Console for database structure

---

Happy coding! 🎉
