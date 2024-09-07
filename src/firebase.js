// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhMxfk3TlfZZ_jYuxe-PokBeZwJIUdtTk",
  authDomain: "chemlabims-d3c76.firebaseapp.com",
  projectId: "chemlabims-d3c76",
  storageBucket: "chemlabims-d3c76.appspot.com",
  messagingSenderId: "514946063433",
  appId: "1:514946063433:web:dfb509302537e512dbb398",
  measurementId: "G-NPG8L8BJ0S"
};

let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { storage, firestore, auth };