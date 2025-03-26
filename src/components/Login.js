import React from "react";
import { auth, provider, signInWithPopup } from "../firebase-config";
import axios from "axios";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Send token to the backend for verification
      const response = await axios.post("http://localhost:5000/api/verify-token", { token });
      console.log(response.data);
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;
