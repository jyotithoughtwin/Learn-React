import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/signup" element={<SignupPage />} />
      <Route exact path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default App;
