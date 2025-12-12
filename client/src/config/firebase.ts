import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyATnitCyWBGQlmdByHrXlUw5KIEOmnZMrM",
    authDomain: "booking-care-clone.firebaseapp.com",
    projectId: "booking-care-clone",
    storageBucket: "booking-care-clone.firebasestorage.app",
    messagingSenderId: "9511725566",
    appId: "1:9511725566:web:bad9da4fee36ec880638af",
    measurementId: "G-9ERSTSY992"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
setPersistence(auth, browserSessionPersistence);
export const db = getFirestore(app);
