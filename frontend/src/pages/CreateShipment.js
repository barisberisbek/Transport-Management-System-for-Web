import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { shipmentAPI } from '../services/api';

function CreateShipment({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Fresh',
    weight: '',
    destination: '',
    destination_country: '',
    container_type: 'Small'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateTime = (value) => value ? new Date(value).toLocaleString('tr-TR') : '—';

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
    if (!formData.product_name || !formData.weight || !formData.destination) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.weight <= 0) {
      setError('Weight must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      const response = await shipmentAPI.create(formData);
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.alert || 'Failed to create shipment');
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="dashboard">
        <Navbar user={user} onLogout={onLogout} />
        
        <main className="dashboard-content">
          <div className="container">
            <div className="card" style={{maxWidth: '800px', margin: '2rem auto'}}>
              <div className="text-center" style={{marginBottom: '2rem'}}>
                <h1 style={{color: 'var(--secondary-color)'}}>✅ Shipment Created Successfully!</h1>
                <p style={{fontSize: '1.125rem'}}>Order ID: <strong>#{result.shipment.id}</strong></p>
              </div>

              <section aria-labelledby="shipment-details">
                <h2 id="shipment-details">Shipment Details</h2>
                <div style={{display: 'grid', gap: '1rem', marginBottom: '2rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Product:</span>
                    <strong>{result.shipment.product_name}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Category:</span>
                    <strong>{result.shipment.category}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Weight:</span>
                    <strong>{result.shipment.weight} kg</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Container Type:</span>
                    <strong>{result.shipment.container_type}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Destination:</span>
                    <strong>{result.shipment.destination}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Distance:</span>
                    <strong>{result.priceBreakdown.distance}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Order Date:</span>
                    <strong>{formatDateTime(result.shipment.created_at)}</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Invoice #:</span>
                    <strong>{result.invoice?.number || '—'}</strong>
                  </div>
                </div>

                <div className="alert alert-info">
                  <h3 style={{marginBottom: '1rem'}}>Price Breakdown</h3>
                  <p><strong>Formula:</strong> {result.priceBreakdown.formula}</p>
                  <p><strong>Rate per km:</strong> {result.priceBreakdown.ratePerKm}</p>
                  <p><strong>Issued At:</strong> {formatDateTime(result.priceBreakdown.issuedAt || result.invoice?.issuedAt)}</p>
                  <p style={{fontSize: '1.5rem', marginTop: '1rem'}}>
                    <strong>Total Price: {result.priceBreakdown.totalPrice}</strong>
                  </p>
                  <p><strong>Estimated Delivery:</strong> {result.priceBreakdown.estimatedDelivery}</p>
                </div>
              </section>

              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                <button onClick={() => setResult(null)} className="btn btn-outline">
                  Create Another Shipment
                </button>
                <button onClick={() => navigate('/customer')} className="btn btn-primary">
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="card" style={{maxWidth: '800px', margin: '2rem auto'}}>
            <h1>📦 Create Shipment</h1>
            <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>
              Enter product details to get instant price calculation
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="product_name" className="form-label">Product Name *</label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  className="form-input"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="e.g., Fresh Blueberries"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Fresh">Fresh</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Organic">Organic</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="weight" className="form-label">Weight (kg) *</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="form-input"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="container_type" className="form-label">Container Type *</label>
                <select
                  id="container_type"
                  name="container_type"
                  className="form-select"
                  value={formData.container_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Small">Small (2,000 kg - ₺5/km)</option>
                  <option value="Medium">Medium (5,000 kg - ₺8/km)</option>
                  <option value="Large">Large (10,000 kg - ₺12/km)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="destination" className="form-label">Destination City *</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    className="form-input"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Berlin, Germany"
                    list="destinations"
                    required
                  />
                  <datalist id="destinations">
                    <option value="Berlin, Germany" />
                    <option value="Paris, France" />
                    <option value="London, UK" />
                    <option value="Rome, Italy" />
                    <option value="Madrid, Spain" />
                    <option value="Amsterdam, Netherlands" />
                    <option value="Athens, Greece" />
                    <option value="Istanbul, Turkey" />
                    <option value="Dubai, UAE" />
                    <option value="New York, USA" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label htmlFor="destination_country" className="form-label">Country</label>
                  <input
                    type="text"
                    id="destination_country"
                    name="destination_country"
                    className="form-input"
                    value={formData.destination_country}
                    onChange={handleChange}
                    placeholder="Auto-filled or manual"
                  />
                </div>
              </div>

              <div className="alert alert-info">
                <strong>Note:</strong> Prices are calculated from Muğla based on distance and container type. 
                Your inventory will be automatically updated upon shipment creation.
              </div>

              <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                {loading ? 'Creating Shipment...' : 'Calculate Price & Create Shipment'}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default CreateShipment;

