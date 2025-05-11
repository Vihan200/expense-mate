import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCQjBCPId-wrbpcUmXDjKbt7KgrLO9ScG8",
  authDomain: "expensemate-e7559.firebaseapp.com",
  projectId: "expensemate-e7559",
  storageBucket: "expensemate-e7559.firebasestorage.app",
  messagingSenderId: "784945572905",
  appId: "1:784945572905:web:78242006370f6075490038",
  measurementId: "G-D8KMJRCCF6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);
const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BPCJruupdXT9GlI2xkVSCj8tjbRcN9hzKtBLOvlzlrEpRoXsAXp3lHc1DKCkecUX34wMbhq5bdf35H5Ke4Hhg0I",
      });
      console.log("FCM Token:", token);
      localStorage.setItem("fcmtoken", token); 
      return token;
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export { auth, provider, signInWithPopup, messaging, generateToken, onMessage };
