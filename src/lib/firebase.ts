import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOC6WcTgzkfXO_eCcOxe7AeBfgH9SMIjY",
  authDomain: "medhack-d12cc.firebaseapp.com",
  projectId: "medhack-d12cc",
  storageBucket: "medhack-d12cc.firebasestorage.app",
  messagingSenderId: "212809614690",
  appId: "1:212809614690:web:c7e10450c931925f49d83b",
  measurementId: "G-HZC076EK0V"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
}

export { db, analytics };
