import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!formData.username || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main className="form-container" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="form-card" style={{width: '100%'}}>
          <div className="text-center" style={{marginBottom: '2rem'}}>
            <h1>🚢 Login</h1>
            <p style={{color: 'var(--text-light)'}}>Access your Transport Management account</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center" style={{marginTop: '1.5rem'}}>
            <p style={{color: 'var(--text-light)'}}>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <p style={{marginTop: '1rem'}}>
              <Link to="/">← Back to Home</Link>
            </p>
          </div>

          <div className="alert alert-info" style={{marginTop: '2rem'}}>
            <strong>Demo Accounts:</strong><br />
            Admin: username: <code>admin</code>, password: <code>admin123</code><br />
            (Or register as a Customer)
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

