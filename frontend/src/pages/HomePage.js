import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomePage({ user, onLogout }) {
  return (
    <div className="app">
      <Navbar user={user} onLogout={onLogout} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🌍 Global Transport & Management System</h1>
          <p>Shipping excellence from Muğla to destinations worldwide</p>
          <p style={{fontSize: '1rem', marginBottom: '2rem'}}>
            📍 Head Office: Muğla, Turkey
          </p>
          
          <div className="hero-buttons">
            {user && user.role === 'Customer' && (
              <Link to="/customer/create-shipment" className="btn btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
                Create Shipment
              </Link>
            )}
            {!user && (
              <>
                <Link to="/register" className="btn btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline" style={{fontSize: '1.125rem', padding: '1rem 2rem', color: 'white', borderColor: 'white'}}>
                  Login
                </Link>
              </>
            )}
            <Link to="/track" className="btn btn-secondary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Track Shipment
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <main className="container" style={{padding: '3rem 1rem'}}>
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-center" style={{marginBottom: '2rem'}}>Our Services</h2>
          
          <div className="dashboard-grid">
            <article className="stat-card">
              <h3>📦</h3>
              <h4>Shipment Management</h4>
              <p>Create and track shipments with automatic price calculation based on distance and container type</p>
            </article>
            
            <article className="stat-card">
              <h3>🚚</h3>
              <h4>Container Optimization</h4>
              <p>Intelligent bin-packing algorithm maximizes container utilization and reduces costs</p>
            </article>
            
            <article className="stat-card">
              <h3>🚢</h3>
              <h4>Fleet Management</h4>
              <p>3 ships for international deliveries and 4 trucks for domestic transport</p>
            </article>
            
            <article className="stat-card">
              <h3>💰</h3>
              <h4>Financial Tracking</h4>
              <p>Comprehensive revenue, expense, and tax calculations with detailed reporting</p>
            </article>
            
            <article className="stat-card">
              <h3>🫐</h3>
              <h4>Inventory Management</h4>
              <p>Real-time tracking of blueberry stock (Fresh, Frozen, Organic) with low-stock alerts</p>
            </article>
            
            <article className="stat-card">
              <h3>📈</h3>
              <h4>Analytics & Reports</h4>
              <p>Detailed business intelligence with route analytics and performance metrics</p>
            </article>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section aria-labelledby="pricing-heading" style={{marginTop: '3rem'}}>
          <h2 id="pricing-heading" className="text-center" style={{marginBottom: '2rem'}}>Container Types & Pricing</h2>
          
          <div className="table-container card">
            <table>
              <thead>
                <tr>
                  <th>Container Type</th>
                  <th>Capacity</th>
                  <th>Price per km</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Small</strong></td>
                  <td>2,000 kg</td>
                  <td>₺5/km</td>
                </tr>
                <tr>
                  <td><strong>Medium</strong></td>
                  <td>5,000 kg</td>
                  <td>₺8/km</td>
                </tr>
                <tr>
                  <td><strong>Large</strong></td>
                  <td>10,000 kg</td>
                  <td>₺12/km</td>
                </tr>
              </tbody>
            </table>
            <p style={{marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.875rem'}}>
              * Prices calculated from Muğla to your destination
            </p>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="text-center" style={{marginTop: '3rem', padding: '2rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)'}}>
          <h2>Ready to ship your products?</h2>
          <p style={{color: 'var(--text-light)', marginBottom: '1.5rem'}}>
            Join hundreds of satisfied customers shipping globally from Muğla
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Create Account
            </Link>
          )}
          {user && user.role === 'Customer' && (
            <Link to="/customer/create-shipment" className="btn btn-primary" style={{fontSize: '1.125rem', padding: '1rem 2rem'}}>
              Create Your First Shipment
            </Link>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;

