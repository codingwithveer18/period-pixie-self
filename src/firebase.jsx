import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pixie-self.firebaseapp.com",
  projectId: "pixie-self",
  storageBucket: "pixie-self.appspot.com",
  messagingSenderId: "480576781179",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const google = new GoogleAuthProvider(firebaseApp);
const database = getDatabase();
const contactformDB = ref(database, "contact");
const appointformDB = ref(database, "appointment");
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
// Initialize Firebase Cloud Messaging and get a reference to the service

export { auth, google, contactformDB, firestore, storage, appointformDB };
