// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApMQCFVmtDClwhBpfUCF52aBHADyWpIKw",
  authDomain: "openboard-clone.firebaseapp.com",
  projectId: "openboard-clone",
  storageBucket: "openboard-clone.appspot.com",
  messagingSenderId: "961087303082",
  appId: "1:961087303082:web:9b5a76bbcd48c9657ccfd3",
  measurementId: "G-H79VRL3M6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);