import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAf3KJFgXz7i4UjryWQNGD2bH9uedTeYVY",
  authDomain: "cryptkeeper-f695a.firebaseapp.com",
  projectId: "cryptkeeper-f695a",
  storageBucket: "cryptkeeper-f695a.firebasestorage.app",
  messagingSenderId: "354790573765",
  appId: "1:354790573765:web:365702abb10825b7d612ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
