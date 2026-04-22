// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "foodbit-905d5.firebaseapp.com",
    projectId: "foodbit-905d5",
    storageBucket: "foodbit-905d5.firebasestorage.app",
    messagingSenderId: "455720976166",
    appId: "1:455720976166:web:dc56d529acbee7ebd5cbe7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default { app, auth }