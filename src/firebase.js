// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVU5Jbn2sAO3PkRxCtL2tZ5SkpJu0B_vU",
  authDomain: "taskflow-a587d.firebaseapp.com",
  projectId: "taskflow-a587d",
  storageBucket: "taskflow-a587d.firebasestorage.app",
  messagingSenderId: "1048752877601",
  appId: "1:1048752877601:web:3db44b0b15d1f5284c3360",
  measurementId: "G-96B9V66T3S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
