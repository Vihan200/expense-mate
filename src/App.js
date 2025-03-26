import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';
import MyBudgetView from './pages/MyBudgetView';

function App() {
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

export default App;
