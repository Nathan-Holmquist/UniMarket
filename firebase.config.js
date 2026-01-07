// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnYHsIbD08pW1Sjiaw9IT6rktYhAvrWHI",
    authDomain: "campusmart-36974.firebaseapp.com",
    projectId: "campusmart-36974",
    storageBucket: "campusmart-36974.firebasestorage.app",
    messagingSenderId: "173676292404",
    appId: "1:173676292404:web:27fc84dd1addd59c9fdd61",
    measurementId: "G-50GK8L928H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };