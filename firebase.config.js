// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);