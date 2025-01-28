import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
    apiKey: "AIzaSyBFAkXLY2ktW7a88TWNPs8fC51y34eSSac",
    authDomain: "carmanage-59888.firebaseapp.com",
    projectId: "carmanage-59888",
    storageBucket: "carmanage-59888.firebasestorage.app",
    messagingSenderId: "953501316266",
    appId: "1:953501316266:web:62fc2394305a5fb2bb8cd3",
    measurementId: "G-L3CD9EZEC1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const analytics = getAnalytics(app);
