import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

const SignInFirebase = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Sign in user
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the main chat page after successful sign-in
      navigate("/chat");
    } catch (error) {
      console.error("Error signing in:", error);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Sign In</span>
        <form onSubmit={handleSubmit}>
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <button disabled={loading}>Sign In</button>
          {loading && "Signing in, please wait..."}
          {err && <span>Incorrect email or password</span>}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInFirebase;
