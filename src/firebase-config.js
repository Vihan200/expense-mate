import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCQjBCPId-wrbpcUmXDjKbt7KgrLO9ScG8",
    authDomain: "expensemate-e7559.firebaseapp.com",
    projectId: "expensemate-e7559",
    storageBucket: "expensemate-e7559.firebasestorage.app",
    messagingSenderId: "784945572905",
    appId: "1:784945572905:web:78242006370f6075490038",
    measurementId: "G-D8KMJRCCF6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
