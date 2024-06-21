import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pixie-self.firebaseapp.com",
  projectId: "pixie-self",
  storageBucket: "pixie-self.appspot.com",
  messagingSenderId: "480576781179",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const database = getDatabase();
const firestore = getFirestore();
const storage = getStorage();

export { firebaseApp, auth, database, firestore, storage };
