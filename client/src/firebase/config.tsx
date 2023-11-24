import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { initializeApp as adminInitializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAppAdmin = adminInitializeApp();

export const firebaseGoogleAuth = new GoogleAuthProvider();
export const firebaseAuth = getAuth(firebaseApp);
// export const firebaseAuthAdmin = getAdminAuth(firebaseAppAdmin);
// export const firebaseDB = getDatabase(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);
export default firebaseApp;
