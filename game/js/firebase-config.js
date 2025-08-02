import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYd4Q3koWeOOmj6KakUZF4H0f_1dsoWBQ",
  authDomain: "jumpgame-f54ea.firebaseapp.com",
  projectId: "jumpgame-f54ea",
  storageBucket: "jumpgame-f54ea.firebasestorage.app",
  messagingSenderId: "51354244531",
  appId: "1:51354244531:web:a6d6a117f7415defcfe7c6",
  measurementId: "G-VELYVP3QVK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
