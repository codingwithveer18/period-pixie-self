import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCDx8JVrGa-y1bCBeUgiu_Fbx2ZoChGXFk",
  authDomain: "pixie-self.firebaseapp.com",
  projectId: "pixie-self",
  storageBucket: "pixie-self.appspot.com",
  messagingSenderId: "480576781179",
  appId: "1:480576781179:web:dfcee765f6e7b5df115bde",
  measurementId: "G-VXZ5LCTB7R",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const google = new GoogleAuthProvider(firebaseApp);
// Get a reference to the Firebase Realtime Database
const database = getDatabase(); // Don't need to pass firebaseApp here
const contactformDB = ref(database, "contact"); // Use ref() to get a reference

export { auth, google, contactformDB };
