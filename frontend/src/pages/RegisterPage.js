import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function RegisterPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'Customer'
      });
      
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Registration failed' });
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main className="form-container" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="form-card" style={{width: '100%'}}>
          <div className="text-center" style={{marginBottom: '2rem'}}>
            <h1>🚢 Register</h1>
            <p style={{color: 'var(--text-light)'}}>Create your customer account</p>
          </div>

          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={errors.username ? 'true' : 'false'}
                autoComplete="username"
              />
              {errors.username && <p className="form-error" role="alert">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                autoComplete="email"
              />
              {errors.email && <p className="form-error" role="alert">{errors.email}</p>}
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
                aria-invalid={errors.password ? 'true' : 'false'}
                autoComplete="new-password"
              />
              {errors.password && <p className="form-error" role="alert">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="form-error" role="alert">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="text-center" style={{marginTop: '1.5rem'}}>
            <p style={{color: 'var(--text-light)'}}>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
            <p style={{marginTop: '1rem'}}>
              <Link to="/">← Back to Home</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;

