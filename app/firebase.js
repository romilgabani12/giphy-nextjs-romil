import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCxPq1s68Ye7RXb0P0NpmCiKJG2qCgECcU",
  authDomain: "giphy-4ecaf.firebaseapp.com",
  projectId: "giphy-4ecaf",
  storageBucket: "giphy-4ecaf.appspot.com",
  messagingSenderId: "120114342683",
  appId: "1:120114342683:web:d81d8c6ab7de62e74641be"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);