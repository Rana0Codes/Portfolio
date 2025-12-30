// Firebase Configuration
// IMPORTANT: This file is gitignored and should NOT be committed to GitHub

const firebaseConfig = {
    apiKey: "",
    authDomain: "portfolio-rana0codes.firebaseapp.com",
    projectId: "portfolio-rana0codes",
    storageBucket: "portfolio-rana0codes.firebasestorage.app",
    messagingSenderId: "893887532384",
    appId: "1:893887532384:web:07d8f78c89afaf27082205",
    measurementId: "G-JY511H32YL"
};

// Initialize Firebase (using compat version for simplicity)
firebase.initializeApp(firebaseConfig);

// Initialize Firestore and Auth (no Storage needed!)
const db = firebase.firestore();
const auth = firebase.auth();

// Optional: Enable offline persistence for better UX
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.log('Persistence not available');
        }
    });

console.log('Firebase initialized successfully!');

