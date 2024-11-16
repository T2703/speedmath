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
  apiKey: "AIzaSyB7-Yduv4tioBwUdGIufd5NmRidVlHpgeA",
  authDomain: "speed-math-86ac5.firebaseapp.com",
  projectId: "speed-math-86ac5",
  storageBucket: "speed-math-86ac5.firebasestorage.app",
  messagingSenderId: "257194838509",
  appId: "1:257194838509:web:4a1bbee44ecd1ae6b93fe4",
  measurementId: "G-2PMXPFZF8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

setPersistence(auth, browserLocalPersistence) 
  .then(() => {
    console.log('Firebase Auth persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });
export { db, storage, auth, analytics, signInWithEmailAndPassword};