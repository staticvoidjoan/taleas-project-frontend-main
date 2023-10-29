import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const RegisterFirebase = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Check if the user is authenticated
      if (user) {
        // User is authenticated, you can proceed with other actions here.
      }
    });

    return () => {
      // Unsubscribe from the authentication state listener when the component unmounts.
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await updateProfile(auth.currentUser, { displayName });
      // Create user data in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
      });

      // Create empty user chats on Firestore (if needed)
      await setDoc(doc(db, "userChats", res.user.uid), {});

      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <button disabled={loading}>Sign up</button>
          {loading && "Creating user, please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterFirebase;
