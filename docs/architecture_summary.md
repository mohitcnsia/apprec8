# Project Architecture Summary

Based on a review of the codebase, here is a comprehensive summary of the current architecture, outlining how the frontend and backend are structured and how they interact with Firebase and Google Cloud Platform (GCP).

## 1. High-Level Architecture

The project follows a **Serverless Architecture** relying heavily on the Firebase ecosystem. 
- **Frontend**: A cross-platform mobile application built with **React Native** and **Expo**.
- **Backend**: A serverless Node.js backend using **Firebase Cloud Functions**.
- **Database**: **Cloud Firestore** serves as the primary NoSQL database.

## 2. Frontend (React Native + Expo)

The frontend is a React Native app bootstrapped with Expo.
- **UI & Navigation**: It uses `@react-navigation` (Stack, Drawer, Bottom Tabs, Top Tabs) for routing and `react-native-paper` for UI components.
- **Firebase SDK**: It integrates with Firebase directly from the client using the `@react-native-firebase` library suite (App, Auth, Firestore, Functions, Remote Config).
- **State & Data Fetching**: 
  - Data is fetched directly from Firestore using real-time listeners (`onSnapshot`) in the `services/` directory (e.g., `firestoreContentApi.js`).
  - `AsyncStorage` is used for local data persistence.

## 3. Backend (Node.js + Firebase Cloud Functions)

The backend resides in the `functions/` directory and runs on **Node.js 22**. It uses `firebase-functions` to define serverless functions and `firebase-admin` for elevated access to Firebase services.

The backend exposes logic through three primary mechanisms:
1. **Callable Functions (`callable/`)**: These are RPC-style functions designed to be called directly from the Firebase client SDKs. Examples include:
   - `quizActions`: `recordQuizResult`, `penalizeQuizLeave`
   - `userActions`: `getLeaderboard`, `getCurrentUserRank`, `requestAccountDeletion`, `submitFeedback`
2. **REST API Endpoints (`api/`)**: These are standard HTTP endpoints (`functions.https.onRequest`) for CRUD and bulk operations. They are likely used for administrative tasks or content management:
   - `crudOperations.js`: `addCategory`, `addTopic`, `createQuiz`, etc.
   - `bulkOperations.js`: `bulkAddCategories`, `bulkAddTopics`, etc.
3. **Event Triggers (`triggers/`)**: Functions that run automatically in response to background events.
   - `auth.js`: `initializeNewUser` (creates a Firestore user document when a new Firebase Auth user signs up).

## 4. Frontend-Backend Interaction Map

The interaction between the React Native frontend and the Node.js backend is almost entirely facilitated through the Firebase SDK:

- **Direct Database Access (Read)**: The frontend reads data *directly* from Firestore using the `@react-native-firebase/firestore` SDK (bypassing the Node backend for read operations). This is handled in `services/firestoreContentApi.js`.
- **Callable Functions (Write/Complex Logic)**: When the frontend needs to perform complex actions, mutations, or aggregate data, it invokes backend functions using `functions().httpsCallable('functionName')`. This is seen in:
  - `QuizResultScreen.js` calling `recordQuizResult`
  - `StatsScreen.js` calling `getLeaderboard` and `getCurrentUserRank`
  - `FeedbackFAB.js` calling `submitFeedback`
- **External APIs**: The frontend occasionally reaches out to third-party APIs using standard `fetch()` (e.g., hitting `dictionaryapi.dev` in `SpellingBeeGame.js`).

## 5. Firebase and GCP Connections

The project relies on several Firebase/GCP services:
- **Firebase Authentication**: Handles user sign-in (supports Google Sign-In via `@react-native-google-signin/google-signin`).
- **Cloud Firestore**: The central database storing users, categories, topics, quizzes, and study content.
- **Cloud Functions for Firebase**: Hosts the Node.js backend.
- **Firebase Remote Config**: Used to dynamically fetch app configuration parameters (seen in `hooks/useInAppMessaging.js`).
- **Firebase Crashlytics / Analytics**: While not explicitly imported everywhere, the setup suggests readiness for Firebase's app quality and analytics tools.

**GCP Note**: There are no explicit direct connections to raw GCP services (like Cloud Run or Compute Engine) using `@google-cloud` SDKs. All Google Cloud interactions are abstracted through the Firebase layer (`firebase-admin` on the backend and `@react-native-firebase` on the frontend).
