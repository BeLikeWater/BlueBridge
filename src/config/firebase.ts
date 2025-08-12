import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDryfBmvxmiZIhSkndQl0X28Y2YH9ehSMQ",
  authDomain: "mavi-kopru.firebaseapp.com",
  projectId: "mavi-kopru",
  storageBucket: "mavi-kopru.firebasestorage.app",
  messagingSenderId: "986962526853",
  appId: "1:986962526853:web:8db171f51abf6fc5735fec",
  measurementId: "G-G9W55KEXT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;