


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNkyhEM3hIlgZGUBbyh89QDLCVDuUFMNk",
  authDomain: "resqnet-ea58e.firebaseapp.com",
  projectId: "resqnet-ea58e",
  // storageBucket: "resqnet-ea58e.firebasestorage.app",
  storageBucket: "resqnet-ea58e.appspot.com",
  messagingSenderId: "413243115253",
  appId: "1:413243115253:web:db3d0db4cb5752ac5e67bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); 

// export { app };
export { app, storage }; 
