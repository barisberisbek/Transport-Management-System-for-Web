import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { shipmentAPI } from '../services/api';

function TrackShipment({ user, onLogout }) {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!orderId) {
      setError('Please enter an order ID');
      setLoading(false);
      return;
    }

    try {
      const response = await shipmentAPI.track(orderId);
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Shipment not found');
      setResult(null);
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'Pending', label: 'Order Placed', location: 'Muğla Warehouse' },
      { status: 'Ready', label: 'Ready for Transport', location: 'Loading Dock' },
      { status: 'In Transit', label: 'In Transit', location: 'En Route' },
      { status: 'Delivered', label: 'Delivered', location: 'Destination' }
    ];

    const currentIndex = steps.findIndex(s => s.status === result?.shipment.status);
    
    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex
    }));
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="card" style={{maxWidth: '800px', margin: '2rem auto'}}>
            <h1>🔍 Track Shipment</h1>
            <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>
              Enter your order ID to track your shipment
            </p>

            <form onSubmit={handleSubmit} style={{marginBottom: '2rem'}}>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input
                  type="text"
                  className="form-input"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., 1)"
                  style={{flex: 1}}
                  aria-label="Order ID"
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {result && (
              <section className="tracking-result" aria-labelledby="tracking-heading">
                <h2 id="tracking-heading">Shipment Details</h2>
                
                <div style={{display: 'grid', gap: '1rem', marginBottom: '2rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Order ID:</span>
                    <strong>#{result.shipment.id}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Customer:</span>
                    <strong>{result.shipment.customer_name}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Product:</span>
                    <strong>{result.shipment.product_name}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Weight:</span>
                    <strong>{result.shipment.weight} kg</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Destination:</span>
                    <strong>{result.shipment.destination}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Distance:</span>
                    <strong>{result.shipment.distance} km</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Price:</span>
                    <strong>₺{result.shipment.price.toLocaleString('tr-TR')}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Estimated Delivery:</span>
                    <strong>{result.shipment.estimated_delivery_days} days</strong>
                  </div>
                  {result.container && (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>Container:</span>
                      <strong>{result.container.type} (ID: {result.container.id})</strong>
                    </div>
                  )}
                </div>

                <div className="alert alert-info">
                  <h3>Current Status</h3>
                  <p style={{fontSize: '1.25rem', margin: '1rem 0'}}>
                    <strong>{result.tracking.status}</strong>
                  </p>
                  <p>Location: {result.tracking.currentLocation}</p>
                </div>

                <h3 style={{marginTop: '2rem', marginBottom: '1rem'}}>Shipping Timeline</h3>
                <div className="tracking-timeline">
                  {getStatusSteps().map((step, index) => (
                    <div key={index} className="timeline-item">
                      <div className={`timeline-dot ${step.active ? 'active' : ''}`}></div>
                      <div className="timeline-content">
                        <h4>{step.label}</h4>
                        <p style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
                          {step.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default TrackShipment;

