# Firebase Setup Guide for BòsFinder

## Quick Setup (5 minutes)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **BòsFinder** (or any name you prefer)
4. Disable Google Analytics (optional, you can enable later)
5. Click **"Create project"**

### Step 2: Register Your App

1. In your Firebase project, click the **iOS icon** (</>) to add an iOS app
2. Fill in the form:
   - **iOS bundle ID**: `com.bosfinder.app` (must match app.json)
   - **App nickname**: BòsFinder (optional)
   - **App Store ID**: Leave blank for now
3. Click **"Register app"**
4. Download the `GoogleService-Info.plist` (you can skip this for now)
5. Click **"Continue"** and **"Finish"**

### Step 3: Get Your Web Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** and choose **Web** (</> icon)
4. Register the web app with nickname "BòsFinder Web"
5. You'll see your config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 4: Update Your App

1. Copy the config values from Firebase Console
2. Open `src/services/firebase.ts` in your project
3. Replace lines 34-40 with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "your-actual-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### Step 5: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

### Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to Haiti: `us-east1` is good)
5. Click **"Enable"**

### Step 7: Set Up Storage (Optional)

1. In Firebase Console, go to **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Next"** and **"Done"**

---

## Testing Your Setup

After completing the steps above:

1. Rebuild your app: `eas build --platform ios --profile preview`
2. Or if using Expo Go: restart the dev server
3. Try signing up with a test email
4. Check Firebase Console → Authentication to see the new user

---

## Security Notes (Production)

⚠️ Before launching to real users:

1. Update Firestore security rules (currently in test mode)
2. Update Storage security rules
3. Add email verification
4. Set up proper database indexes
5. Configure allowed domains in Authentication settings

---

## Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Your API key is incorrect. Copy it again from Firebase Console.

**Error: "Firebase: Error (auth/project-not-found)"**
- Your projectId is incorrect. Check Firebase Console.

**Can't sign up/sign in:**
- Make sure Email/Password is enabled in Authentication → Sign-in method

**No data loading:**
- Make sure Firestore is created and in test mode
