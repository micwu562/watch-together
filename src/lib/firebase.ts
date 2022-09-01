// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCGqWWPWJ_2e8iw6ur68ujfGYuEqELBh0",
  authDomain: "sp3-watch-yt-together.firebaseapp.com",
  databaseURL: "https://sp3-watch-yt-together-default-rtdb.firebaseio.com",
  projectId: "sp3-watch-yt-together",
  storageBucket: "sp3-watch-yt-together.appspot.com",
  messagingSenderId: "584935806533",
  appId: "1:584935806533:web:6ee011fda41a7f7184b52c",
  measurementId: "G-SHT98YBDDZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
