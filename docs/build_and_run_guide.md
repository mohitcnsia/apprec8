# Build and Run Guide

This document outlines how to build and run the Apprec8 application both locally for development and how to build it for production (Google Play Store).

## 1. Local Development Setup

### Prerequisites
1. **Node.js**: Ensure Node.js is installed (v18 or v22 recommended).
2. **Expo CLI**: Installed globally (`npm install -g expo-cli`) or just use npx (`npx expo`).
3. **EAS CLI**: Required for cloud builds (`npm install -g eas-cli`).
4. **Android Studio**: Required if you want to run the Android emulator locally.
5. **Xcode** (Mac only): Required if you want to run the iOS simulator.

### Running the App Locally

1. **Install Dependencies**
   Navigate to the project root and install the NPM packages:
   ```bash
   npm install
   ```

2. **Start the Metro Bundler**
   Start the development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on a Device or Emulator**
   - Press `a` in the terminal to open the app on an Android emulator or connected Android device.
   - Press `i` to open the app on an iOS simulator.
   - Alternatively, scan the QR code using the **Expo Go** app on your physical device.

*Note: Since the app uses `expo-dev-client`, if you add custom native code in the future, you will need to create a custom development build instead of using standard Expo Go (`npx expo run:android` / `npx expo run:ios`).*

---

## 2. Building for Google Play (Production)

The app is configured to use EAS (Expo Application Services) for builds. While EAS can build in the cloud, you can build locally to avoid Expo server wait times. 

### Prerequisites for Local Building
1. You must have **Android Studio** and the **Android SDK** installed and configured on your machine.
2. You must be logged into EAS CLI:
   ```bash
   eas login
   ```
3. Ensure your Firebase config (`google-services.json` and `.env` variables) are correctly set up, as `app.config.js` relies on them.

### Step 1: Increment the App Version
Before creating a new build for the Play Store, you **must** increment the app version in `app.config.js`. Check the `main` branch to ensure you are incrementing from the most recent production version.

1. Open `app.config.js`.
2. Locate the version variables and increment the `patchVersion` (or `minorVersion`/`majorVersion` as needed):
   ```javascript
   const majorVersion = 20;
   const minorVersion = 0;
   const patchVersion = 9; // Increment this number
   const buildIteration = 0; 
   ```
   *Note: The `androidVersionCode` is automatically calculated based on these variables, so updating the patch version will automatically satisfy Google Play's requirement for a higher version code.*

### Step 2: Triggering a Local Production Build

To create an Android App Bundle (`.aab`) locally, which is required for the Google Play Store, run:

```bash
npx eas build --profile production --platform android --local
```

**What this does:**
- It looks at the `production` profile in `eas.json` (`buildType: "app-bundle"`, `distribution: "store"`).
- The `--local` flag forces EAS to use your machine's local Android SDK to compile the app instead of waiting in the Expo cloud queue.
- It will prompt you for your Android Keystore password if it needs to sign the release.
- Once complete, it will generate an `.aab` file in your project directory (e.g., `build/apprec8-xyz.aab`).

### Step 3: Submitting to Google Play

1. Log in to your [Google Play Console](https://play.google.com/console).
2. Select **Apprec8**.
3. In the left menu, navigate to **Release > Production** (or Internal Testing).
4. Click **Create new release**.
5. Drag and drop the newly generated `.aab` file into the "App bundles" section.
6. Add your release notes, click **Save**, **Review release**, and **Start rollout**.
