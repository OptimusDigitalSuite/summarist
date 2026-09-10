import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialised lazily, never at module scope.
//
// Next prerenders every page on the server at build time, and a top-level
// `getAuth(app)` runs during that pass — where there is no browser and, in CI,
// no NEXT_PUBLIC_ keys. That fails the build with auth/invalid-api-key on a
// page that does not even use auth. Calling these getters from an effect or an
// event handler keeps Firebase strictly on the client.
let appInstance;
let authInstance;
let dbInstance;

function getFirebaseApp() {
  if (!appInstance) {
    if (!firebaseConfig.apiKey) {
      throw new Error(
        "Firebase config is missing. Copy .env.local.example to .env.local and fill in the keys."
      );
    }
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getFirebaseAuth() {
  if (!authInstance) authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getDb() {
  if (!dbInstance) dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
}
