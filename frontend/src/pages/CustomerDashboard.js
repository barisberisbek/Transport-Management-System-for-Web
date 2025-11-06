import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { shipmentAPI } from '../services/api';

function CustomerDashboard({ user, onLogout }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await shipmentAPI.getMyShipments();
      setShipments(response.data.shipments);
      setLoading(false);
    } catch (err) {
      setError('Failed to load shipments');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'status-pending',
      'Ready': 'status-ready',
      'In Transit': 'status-in-transit',
      'Delivered': 'status-delivered'
    };
    return badges[status] || 'status-pending';
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div className="container">
            <h1>Customer Dashboard</h1>
            <p style={{color: 'var(--text-light)'}}>Welcome back, {user.username}!</p>
          </div>
        </div>
        
        <div className="container">
          {/* Quick Actions */}
          <section className="card" aria-labelledby="actions-heading">
            <h2 id="actions-heading">Quick Actions</h2>
            <div style={{display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap'}}>
              <Link to="/customer/create-shipment" className="btn btn-primary">
                📦 Create New Shipment
              </Link>
              <Link to="/track" className="btn btn-outline">
                🔍 Track Shipment
              </Link>
            </div>
          </section>

          {/* Statistics */}
          <div className="dashboard-grid">
            <article className="stat-card">
              <h3>{shipments.length}</h3>
              <p>Total Shipments</p>
            </article>
            
            <article className="stat-card">
              <h3>{shipments.filter(s => s.status === 'Pending').length}</h3>
              <p>Pending</p>
            </article>
            
            <article className="stat-card">
              <h3>{shipments.filter(s => s.status === 'In Transit').length}</h3>
              <p>In Transit</p>
            </article>
            
            <article className="stat-card">
              <h3>{shipments.filter(s => s.status === 'Delivered').length}</h3>
              <p>Delivered</p>
            </article>
          </div>

          {/* Shipments Table */}
          <section className="card" aria-labelledby="shipments-heading">
            <h2 id="shipments-heading">My Shipments</h2>
            
            {loading && <p>Loading shipments...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && !error && shipments.length === 0 && (
              <div className="alert alert-info">
                No shipments yet. <Link to="/customer/create-shipment">Create your first shipment</Link>
              </div>
            )}
            
            {!loading && !error && shipments.length > 0 && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Destination</th>
                      <th>Weight</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td><strong>#{shipment.id}</strong></td>
                        <td>{shipment.product_name}</td>
                        <td>{shipment.destination}</td>
                        <td>{shipment.weight} kg</td>
                        <td>₺{shipment.price.toLocaleString('tr-TR')}</td>
                        <td>
                          <span className={`status ${getStatusBadge(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td>{new Date(shipment.created_at).toLocaleDateString('tr-TR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default CustomerDashboard;

