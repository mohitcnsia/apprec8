// config/firebaseConfig.js (for @react-native-firebase)

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Firebase App initializes automatically via native config files + plugin

// Get Firestore instance
const db = firestore();

// Get Auth instance
const authInstance = auth();

/*
// Optional: Configure Firestore settings (like persistence)
// It's best to call this EARLY and ONCE in your app's main entry point
// (e.g., App.js or index.js) before any other Firestore usage.
// Example for App.js:
// import { useEffect } from 'react';
// import firestore from '@react-native-firebase/firestore';
//
// function App() {
//   useEffect(() => {
//     firestore().settings({
//       persistence: true, // default is true on mobile, but explicit is fine
//       // cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED // Optional: -1 for unlimited
//     }).then(() => console.log('Firestore persistence enabled'))
//       .catch(err => console.error('Firestore persistence error:', err));
//   }, []);
//   // ... rest of App component
// }
*/

// Export the instances for use throughout your app
export { db, authInstance };
