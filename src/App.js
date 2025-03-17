import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UsersManagement from './pages/userManagement';
import ProfilePage from './pages/Profile';
import Login from './components/Login';
import Home from './pages/Home';
import Signup from './pages/SignupPage';

const App = () => {
  const token = localStorage.getItem('authToken'); // Check if token exists

  console.log(`token== ${token}`)

  return (
    // <Router>
      <Routes>
        
         <Route path="/login" element={token ? <Navigate to="/dashboard/home" /> : <Login />} />
         <Route path="/signup" element={token ? <Navigate to="/dashboard/home" /> : <Signup />} />


          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />}>
          <Route path="home" element={<Home />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="profile" element={<ProfilePage />} />
          </Route>

        {/* Catch-all Route - Redirect to Login if not authenticated */}
        <Route path="*" element={<Navigate to={token ? "/dashboard/home" : "/login"} />} />
      </Routes>
    // </Router>
  );
};

export default App;
