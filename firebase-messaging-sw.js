importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCLmu0AVrrz88EUdi8HDtRapUHYbVZ-yHQ",
  authDomain: "snapit-now.firebaseapp.com",
  projectId: "snapit-now",
  storageBucket: "snapit-now.firebasestorage.app",
  messagingSenderId: "672066953267",
  appId: "1:672066953267:web:f972305cd9f4261fa54346",
  measurementId: "G-KPV95KE9X5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/app/icons/icon-192x192.png' // set appropriate icon if you have
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
