import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8-HJLRHOBwNkVwtxygfU-ftJfzotoTOA",
  authDomain: "linkedin-clone-7296d.firebaseapp.com",
  projectId: "linkedin-clone-7296d",
  storageBucket: "linkedin-clone-7296d.appspot.com",
  messagingSenderId: "702005024035",
  appId: "1:702005024035:web:da206767812ce5ed86e896",
  measurementId: "G-K9LZ748693",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

export { auth, provider, storage };
export default db;
