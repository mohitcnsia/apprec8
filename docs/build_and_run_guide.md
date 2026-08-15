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

The app is configured to use EAS (Expo Application Services) for cloud builds, as defined in `eas.json`.

### Prerequisites for Building
1. You must be logged into EAS CLI:
   ```bash
   eas login
   ```
2. Ensure your Firebase config (`google-services.json` and `.env` variables) are correctly set up, as `app.config.js` relies on them.

### Triggering a Production Build

To create an Android App Bundle (`.aab`) which is required for the Google Play Store:

```bash
eas build --platform android --profile production
```

**What this does:**
- It looks at the `production` profile in `eas.json`.
- It sets `buildType: "app-bundle"` and `developmentClient: false`.
- It builds the app on Expo's cloud servers.
- Once complete, it will provide a link to download the `.aab` file.

### Submitting to Google Play

You can download the `.aab` file from the Expo dashboard and upload it manually to the Google Play Console, OR you can automate the submission using EAS Submit:

```bash
eas submit --platform android --profile production
```
*(You will need to have configured a Google Play Service Account key in your Expo dashboard for automated submissions).*
