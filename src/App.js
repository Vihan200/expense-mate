import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";
import MyBudgetView from "./pages/MyBudgetView";
import { generateToken, onMessage, messaging } from "../src/firebase-config";
import { useNotifications, NotificationProvider } from "./NotificationContext";
import axios from "axios";

function App() {
  const { addNotification } = useNotifications();

  const sendTokenToBackend = async () => {
    try {
      const token = localStorage.getItem('fcmtoken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/notifications/store-token`,
        { token }
      );
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  useEffect( () => {
    generateToken();
    sendTokenToBackend();
    onMessage(messaging, (payload) => {
      console.log(payload);
      addNotification(payload);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/group/:id" element={<GroupDetail />} />
        <Route path="/my-budget" element={<MyBudgetView />} />
      </Routes>
    </Router>
  );
}

export default function WrappedApp() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}
