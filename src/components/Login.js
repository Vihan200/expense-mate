import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase-config";
import axios from "axios";
import { generateToken } from '../firebase-config';

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // Set prompt to 'select_account' to show the Gmail selection screen
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Perform the sign-in with the popup
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const email = result.user.email; // Capture user's Gmail address
      const displayName = result.user.displayName;

      // Send token to the backend for verification
      const response = await axios.post(
        "http://localhost:5000/api/verify-token",
        { token }
      );

      if (response.status === 200) {
        localStorage.setItem("email", email); // Save email
        localStorage.setItem("displayName", displayName); // Save display name
        navigate("/dashboard"); // Redirect to dashboard
        const fcmToken = await generateToken();
        await sendTokenToBackend(fcmToken);
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/notifications/store-token",
        { token }
      );
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Welcome to Expense Mate
        </h2>
        <p style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
          Please sign in with your Google account to continue.
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            padding: "10px 20px",
            fontSize: "18px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Icon"
            style={{ width: "24px", height: "24px" }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
