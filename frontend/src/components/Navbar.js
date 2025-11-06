import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span>🚢</span>
          <span>Transport & Management System</span>
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link to="/track" className="nav-link">Track Shipment</Link>
          </li>
          
          {!user && (
            <>
              <li>
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li>
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
          
          {user && user.role === 'Customer' && (
            <>
              <li>
                <Link to="/customer" className="nav-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/customer/create-shipment" className="nav-link">Create Shipment</Link>
              </li>
            </>
          )}
          
          {user && user.role === 'Admin' && (
            <li>
              <Link to="/admin" className="nav-link">Admin Dashboard</Link>
            </li>
          )}
          
          {user && (
            <li>
              <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

