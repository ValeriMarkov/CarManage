// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth module
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (this should be the code you received from Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyBFAkXLY2ktW7a88TWNPs8fC51y34eSSac",
    authDomain: "carmanage-59888.firebaseapp.com",
    projectId: "carmanage-59888",
    storageBucket: "carmanage-59888.firebasestorage.app",
    messagingSenderId: "953501316266",
    appId: "1:953501316266:web:62fc2394305a5fb2bb8cd3",
    measurementId: "G-L3CD9EZEC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (this is what we'll use for authentication)
export const auth = getAuth(app);

// Optional: Initialize Analytics (you can use this if you're using analytics, but it's not needed for auth)
const analytics = getAnalytics(app);
