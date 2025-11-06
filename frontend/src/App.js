import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CreateShipment from './pages/CreateShipment';
import TrackShipment from './pages/TrackShipment';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={
            user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/customer'} /> : 
            <LoginPage onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/customer" /> : 
            <RegisterPage onLogin={handleLogin} />
          } />
          <Route path="/track" element={<TrackShipment user={user} onLogout={handleLogout} />} />

          {/* Customer Routes */}
          <Route path="/customer" element={
            user && user.role === 'Customer' ? 
            <CustomerDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } />
          <Route path="/customer/create-shipment" element={
            user && user.role === 'Customer' ? 
            <CreateShipment user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            user && user.role === 'Admin' ? 
            <AdminDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

