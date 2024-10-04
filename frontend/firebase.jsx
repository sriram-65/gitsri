// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDORsW3tjyHwlN-Seof-10w22e9j9MqgSY",
    authDomain: "fir-c24bc.firebaseapp.com",
    projectId: "fir-c24bc",
    storageBucket: "fir-c24bc.appspot.com",
    messagingSenderId: "528128097185",
    appId: "1:528128097185:web:88b630a207940792dca9e0"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign in function
const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
      alert(`Welcome  ${result.user.displayName} , thanks for Authorized`);
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

// Sign out function
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      alert('You have successfully signed out');
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

export { auth, signInWithGoogle, signOutUser };
