# 🎯 BòsFinder Setup Checklist

Use this checklist to get your app up and running!

## ☑️ Pre-Development Setup

- [ ] **Review Project Structure**
  - [ ] Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for overview
  - [ ] Read [README.md](README.md) for full documentation
  - [ ] Read [QUICKSTART.md](QUICKSTART.md) for quick setup

## ☑️ Firebase Configuration (CRITICAL)

- [ ] **Create Firebase Project**
  - [ ] Go to [Firebase Console](https://console.firebase.google.com/)
  - [ ] Click "Add project"
  - [ ] Name it "BòsFinder" (or your choice)
  - [ ] Complete setup wizard

- [ ] **Get Firebase Config**
  - [ ] In Firebase Console → Project Settings
  - [ ] Scroll to "Your apps" section
  - [ ] Click "Web" app icon (</>) to add web app
  - [ ] Copy the `firebaseConfig` object

- [ ] **Update App Config**
  - [ ] Open `src/services/firebase.ts`
  - [ ] Find lines 34-40 (the firebaseConfig object)
  - [ ] Replace with your actual Firebase config
  - [ ] Save the file

- [ ] **Enable Authentication**
  - [ ] In Firebase Console → Authentication
  - [ ] Click "Get Started"
  - [ ] Select "Email/Password" provider
  - [ ] Toggle "Email/Password" to enabled
  - [ ] Click "Save"

- [ ] **Create Firestore Database**
  - [ ] In Firebase Console → Firestore Database
  - [ ] Click "Create database"
  - [ ] Select "Start in test mode" (for development)
  - [ ] Choose location close to Haiti (e.g., us-east1)
  - [ ] Click "Enable"

## ☑️ Development Environment

- [ ] **Verify Installation**
  - [ ] Node.js installed: `node --version` (should be v16+)
  - [ ] npm installed: `npm --version`
  - [ ] Expo CLI: `npx expo --version`

- [ ] **Install Dependencies** (already done, but if needed)
  - [ ] Run: `npm install`
  - [ ] Wait for completion (should show no errors)

## ☑️ Run the App

- [ ] **Start Development Server**
  - [ ] Run: `npm start`
  - [ ] Wait for QR code to appear

- [ ] **Run on Device/Emulator**
  - [ ] For Android: Press `a` or run `npm run android`
  - [ ] For iOS: Press `i` or run `npm run ios` (macOS only)
  - [ ] Or scan QR code with Expo Go app on phone

- [ ] **Verify App Loads**
  - [ ] App should show Welcome screen
  - [ ] No red error screens
  - [ ] Check terminal for any warnings

## ☑️ Test Basic Functionality

- [ ] **Test Client Flow**
  - [ ] Click "Sign In / Sign Up"
  - [ ] Fill in email, password, name, phone
  - [ ] Click "Create Account"
  - [ ] Select "I am a Client"
  - [ ] Should navigate to Client Home screen
  - [ ] Try browsing (will be empty until Bòs profiles exist)

- [ ] **Test Bòs Flow** (use different email)
  - [ ] Sign out from Profile tab
  - [ ] Sign up with different email
  - [ ] Select "I am a Bòs (Professional)"
  - [ ] Should see "Complete Your Profile" screen
  - [ ] Fill out profile form:
    - [ ] Display Name
    - [ ] Select at least one category
    - [ ] Description
    - [ ] Commune and City
    - [ ] Years of experience
    - [ ] WhatsApp number (optional)
  - [ ] Click "Create Profile"
  - [ ] Should navigate to Dashboard

- [ ] **Test Job Request Creation**
  - [ ] Sign in as Client
  - [ ] Go to "My Requests" tab
  - [ ] Click "+ New Request" or "Post First Request"
  - [ ] Fill out job request form
  - [ ] Click "Post Job Request"
  - [ ] Verify request appears in list

- [ ] **Test Job Request Unlocking**
  - [ ] Sign in as Bòs
  - [ ] Go to "Jobs" tab
  - [ ] Should see the job request created by client
  - [ ] Click on the job request
  - [ ] Click "Unlock Contact (1 Credit)"
  - [ ] Confirm the unlock
  - [ ] Verify contact information is revealed
  - [ ] Verify credits decreased on Dashboard

## ☑️ Verify Data in Firebase

- [ ] **Check Firebase Console**
  - [ ] Go to Firestore Database
  - [ ] Should see collections:
    - [ ] `users` - with your test accounts
    - [ ] `bosProfiles` - with your Bòs profile
    - [ ] `jobRequests` - with your test job request
    - [ ] `leads` - with unlock record

## ☑️ Customization (Optional)

- [ ] **Update Branding**
  - [ ] Update app icon in `assets/icon.png`
  - [ ] Update splash screen in `assets/splash-icon.png`
  - [ ] Update app name in `app.json`

- [ ] **Customize Categories**
  - [ ] Edit `src/types/index.ts`
  - [ ] Update `CATEGORIES` array with your services
  - [ ] Update `COMMUNES` array with your locations

- [ ] **Adjust Colors**
  - [ ] Find and replace `#2563EB` with your primary color
  - [ ] Find and replace `#10B981` with your secondary color

## ☑️ Production Preparation

- [ ] **Security Rules**
  - [ ] In Firebase Console → Firestore Database → Rules
  - [ ] Copy security rules from README.md
  - [ ] Replace default rules
  - [ ] Click "Publish"

- [ ] **Test on Real Devices**
  - [ ] Test on Android phone
  - [ ] Test on iOS phone (if available)
  - [ ] Test with poor network connection
  - [ ] Test all critical flows

- [ ] **Build for Distribution**
  - [ ] Install EAS CLI: `npm install -g eas-cli`
  - [ ] Configure: `eas build:configure`
  - [ ] Build: `eas build --platform android`

## 📝 Notes

**Having Issues?**
1. Check Firebase config is correct in `src/services/firebase.ts`
2. Verify Firebase services are enabled in Firebase Console
3. Clear Expo cache: `expo start -c`
4. Check [DEVELOPMENT.md](DEVELOPMENT.md) for debugging tips

**Need Help?**
- Review the full [README.md](README.md)
- Check code comments in files
- Verify Firebase Console for data structure

---

**Once all checkboxes are complete, your app is ready for development and testing!** 🎉

For ongoing development, refer to [DEVELOPMENT.md](DEVELOPMENT.md).
