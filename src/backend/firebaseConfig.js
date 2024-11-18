// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth , signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "math",
  authDomain: "math",
  projectId: "math",
  storageBucket: "math",
  messagingSenderId: "math",
  appId: "math",
  measurementId: "math"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence) 
  .then(() => {
    console.log('Firebase Auth persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });
export { db, auth, analytics, signInWithEmailAndPassword};