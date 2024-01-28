// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "yassshus-blog.firebaseapp.com",
  projectId: "yassshus-blog",
  storageBucket: "yassshus-blog.appspot.com",
  messagingSenderId: "488230267585",
  appId: "1:488230267585:web:97d9996401eb7f92434240",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
