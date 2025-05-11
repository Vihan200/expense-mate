importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCQjBCPId-wrbpcUmXDjKbt7KgrLO9ScG8",
  authDomain: "expensemate-e7559.firebaseapp.com",
  projectId: "expensemate-e7559",
  storageBucket: "expensemate-e7559.firebasestorage.app",
  messagingSenderId: "784945572905",
  appId: "1:784945572905:web:78242006370f6075490038",
  measurementId: "G-D8KMJRCCF6",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
