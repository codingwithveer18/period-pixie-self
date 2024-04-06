import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const database = getDatabase();
const contactformDB = ref(database, "contact");
const appointformDB = ref(database, "appointment");
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, google, contactformDB, firestore, storage, appointformDB };
