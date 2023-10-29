  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
  } from "firebase/firestore";

  
  // Define the Firebase configuration object
  const firebaseConfig = {
    apiKey: "AIzaSyCl7F9QpwtRokqU2NqYr3lrABZjWzdVfjA",
    authDomain: "test-20622.firebaseapp.com",
    projectId: "test-20622",
    storageBucket: "test-20622.appspot.com",
    messagingSenderId: "684340633344",
    appId: "1:684340633344:web:a22f6397a245d153e15de5",
    measurementId: "G-J1E5BTTK98"
  };
  
  // Now you can use the firebaseConfig object
  console.log(firebaseConfig);
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


  export { db };
