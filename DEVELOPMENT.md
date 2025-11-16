# Development Guide

## 🛠️ Development Workflow

### Starting Development

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Clear cache if needed
expo start -c
```

### Making Changes

#### Adding a New Screen

1. Create the screen file in the appropriate folder:
   ```typescript
   // src/screens/client/NewScreen.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   
   export const NewScreen: React.FC = () => {
     return (
       <View style={styles.container}>
         <Text>New Screen</Text>
       </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#F9FAFB',
     },
   });
   ```

2. Export it in the index file:
   ```typescript
   // src/screens/client/index.ts
   export { NewScreen } from './NewScreen';
   ```

3. Add to navigation:
   ```typescript
   // src/navigation/ClientNavigator.tsx
   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```

4. Update navigation types:
   ```typescript
   // src/navigation/types.ts
   export type ClientStackParamList = {
     // ... existing screens
     NewScreen: undefined; // or { param1: string } if has params
   };
   ```

#### Adding a New Component

1. Create component file:
   ```typescript
   // src/components/NewComponent.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   
   interface NewComponentProps {
     title: string;
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
     return (
       <View style={styles.container}>
         <Text style={styles.title}>{title}</Text>
       </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       padding: 16,
     },
     title: {
       fontSize: 18,
       fontWeight: '600',
     },
   });
   ```

2. Export from components index:
   ```typescript
   // src/components/index.ts
   export { NewComponent } from './NewComponent';
   ```

#### Adding Firebase Functionality

Add new functions to `src/services/firebase.ts`:

```typescript
/**
 * Your new Firebase function
 */
export const yourNewFunction = async (param: string): Promise<ReturnType> => {
  try {
    // Your Firebase logic here
    const result = await someFirebaseOperation(param);
    return result;
  } catch (error) {
    console.error('Error in yourNewFunction:', error);
    throw error;
  }
};
```

### Common Tasks

#### Updating User Interface

1. **Colors**: Update color values in StyleSheet.create() sections
2. **Fonts**: Add custom fonts in assets and update app.json
3. **Icons**: Use emoji for now, or install react-native-vector-icons

#### Adding New Data Fields

1. Update TypeScript types in `src/types/index.ts`
2. Update Firebase operations in `src/services/firebase.ts`
3. Update relevant screens to display/edit the new fields

#### Testing Authentication

Create test accounts:

```typescript
// Client account
Email: client@test.com
Password: test123
Role: Client

// Bòs account
Email: bos@test.com
Password: test123
Role: Bòs
```

### Debugging Tips

#### View Logs

```bash
# All logs
expo start

# Android logs only
adb logcat

# iOS logs only
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "YourApp"'
```

#### Common Errors

**Error: Firebase not initialized**
- Check that you've updated the config in `src/services/firebase.ts`

**Error: Module not found**
- Run `npm install`
- Clear cache with `expo start -c`

**Error: Navigation error**
- Check that screen names match between navigator and types
- Ensure all screens are properly exported

#### React DevTools

```bash
# Install React DevTools
npm install -g react-devtools

# Run it
react-devtools
```

### Testing Flows

#### Test Client Flow

1. Sign up as client
2. Browse Bòs profiles
3. View a Bòs profile
4. Create a job request
5. View your job requests

#### Test Bòs Flow

1. Sign up as Bòs
2. Complete profile setup
3. View available jobs
4. Unlock a client contact (uses 1 credit)
5. Contact client via WhatsApp

### Performance Tips

1. **Use FlatList for long lists** - Already implemented in list screens
2. **Implement pagination** - Add to Firestore queries with `startAfter`
3. **Optimize images** - Use proper image sizes
4. **Memo expensive components** - Use React.memo() for cards

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

### Code Style

Follow these conventions:

- **Components**: PascalCase (e.g., `BosCard`)
- **Functions**: camelCase (e.g., `createUser`)
- **Files**: Match component name (e.g., `BosCard.tsx`)
- **Styles**: Use StyleSheet.create() at bottom of file
- **Types**: Define interfaces before component

### Useful Commands

```bash
# Install new package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update packages
npm update

# Check for outdated packages
npm outdated

# Build for production
eas build --platform android
eas build --platform ios
```

### Environment Variables

For sensitive data, use environment variables:

1. Install expo-constants:
   ```bash
   npm install expo-constants
   ```

2. Create `app.config.js`:
   ```javascript
   export default {
     expo: {
       extra: {
         firebaseApiKey: process.env.FIREBASE_API_KEY,
       },
     },
   };
   ```

3. Access in code:
   ```typescript
   import Constants from 'expo-constants';
   const apiKey = Constants.expoConfig?.extra?.firebaseApiKey;
   ```

## 🚀 Deployment

### Prepare for Production

1. Update Firebase security rules
2. Test all user flows
3. Add error tracking (e.g., Sentry)
4. Add analytics (e.g., Firebase Analytics)
5. Test on real devices
6. Get app icons and splash screen designed

### Build with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Submit to Stores

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## 📱 Testing Checklist

Before deploying:

- [ ] Test authentication (sign up, sign in, sign out)
- [ ] Test client flow completely
- [ ] Test Bòs flow completely
- [ ] Test on Android device
- [ ] Test on iOS device
- [ ] Test with poor internet connection
- [ ] Test form validations
- [ ] Test error scenarios
- [ ] Verify Firebase security rules
- [ ] Check for console errors
- [ ] Test deeplinks (if added)
- [ ] Test push notifications (if added)

---

Happy coding! If you need help, check the README.md for full documentation.
