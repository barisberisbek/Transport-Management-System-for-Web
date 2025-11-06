import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  shipmentAPI,
  containerAPI,
  fleetAPI,
  inventoryAPI,
  financialAPI,
  reportAPI
} from '../services/api';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('shipments');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      switch (activeTab) {
        case 'shipments':
          const shipmentsRes = await shipmentAPI.getAll();
          setData({ shipments: shipmentsRes.data.shipments });
          break;
        case 'containers':
          const containersRes = await containerAPI.getAll();
          setData({ containers: containersRes.data.containers, stats: containersRes.data.stats });
          break;
        case 'fleet':
          const fleetRes = await fleetAPI.getAll();
          setData({ fleet: fleetRes.data.fleet, stats: fleetRes.data.stats });
          break;
        case 'financials':
          const financialRes = await financialAPI.getSummary();
          setData({ financial: financialRes.data });
          break;
        case 'inventory':
          const inventoryRes = await inventoryAPI.getAll();
          setData({ inventory: inventoryRes.data.inventory, alerts: inventoryRes.data.alerts });
          break;
        case 'reports':
          const reportRes = await reportAPI.generate();
          setData({ report: reportRes.data.report });
          break;
        default:
          break;
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'shipments', label: '📦 Shipments', icon: '📦' },
    { id: 'containers', label: '🚚 Container Optimization', icon: '🚚' },
    { id: 'fleet', label: '🚢 Fleet Management', icon: '🚢' },
    { id: 'financials', label: '💰 Financials', icon: '💰' },
    { id: 'inventory', label: '🫐 Inventory', icon: '🫐' },
    { id: 'reports', label: '📈 Reports', icon: '📈' }
  ];

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div className="container">
            <h1>Admin Dashboard</h1>
            <p style={{color: 'var(--text-light)'}}>Manage your transport operations</p>
          </div>
        </div>
        
        <div className="container">
          {/* Tabs */}
          <nav className="admin-tabs" role="tablist" aria-label="Admin dashboard sections">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Message */}
          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          <div role="tabpanel" id={`${activeTab}-panel`}>
            {loading ? (
              <div className="loading-container" style={{minHeight: '300px'}}>
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                {activeTab === 'shipments' && <ShipmentsTab data={data} setMessage={setMessage} reload={loadTabData} />}
                {activeTab === 'containers' && <ContainersTab data={data} setMessage={setMessage} reload={loadTabData} />}
                {activeTab === 'fleet' && <FleetTab data={data} setMessage={setMessage} reload={loadTabData} />}
                {activeTab === 'financials' && <FinancialsTab data={data} setMessage={setMessage} reload={loadTabData} />}
                {activeTab === 'inventory' && <InventoryTab data={data} setMessage={setMessage} reload={loadTabData} />}
                {activeTab === 'reports' && <ReportsTab data={data} />}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Tab 1: Shipments
function ShipmentsTab({ data, setMessage, reload }) {
  const shipments = data.shipments || [];

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await shipmentAPI.updateStatus(id, newStatus);
      setMessage({ type: 'success', text: 'Status updated successfully' });
      reload();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update status' });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-warning',
      'Ready': 'badge-primary',
      'In Transit': 'badge-primary',
      'Delivered': 'badge-success'
    };
    return badges[status] || 'badge-primary';
  };

  return (
    <section className="card" aria-labelledby="shipments-heading">
      <h2 id="shipments-heading">All Shipments ({shipments.length})</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Weight</th>
              <th>Destination</th>
              <th>Container</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(shipment => (
              <tr key={shipment.id}>
                <td><strong>#{shipment.id}</strong></td>
                <td>{shipment.customer_name}</td>
                <td>{shipment.product_name}</td>
                <td>{shipment.weight} kg</td>
                <td>{shipment.destination}</td>
                <td>{shipment.container_id ? `#${shipment.container_id}` : 'Not assigned'}</td>
                <td>₺{shipment.price.toLocaleString('tr-TR')}</td>
                <td><span className={`badge ${getStatusBadge(shipment.status)}`}>{shipment.status}</span></td>
                <td>
                  <select
                    value={shipment.status}
                    onChange={(e) => handleStatusUpdate(shipment.id, e.target.value)}
                    className="form-select"
                    style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}
                    aria-label={`Change status for shipment ${shipment.id}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ready">Ready</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Tab 2: Container Optimization
function ContainersTab({ data, setMessage, reload }) {
  const containers = data.containers || [];
  const stats = data.stats || {};

  const handleOptimize = async () => {
    try {
      const response = await containerAPI.optimize();
      setMessage({ 
        type: 'success', 
        text: response.data.message + ` - ${response.data.optimization.totalShipmentsAssigned} shipments assigned to ${response.data.optimization.containersUsed} containers`
      });
      reload();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Optimization failed' });
    }
  };

  return (
    <>
      <section className="card" aria-labelledby="container-stats-heading">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 id="container-stats-heading">Container Overview</h2>
          <button onClick={handleOptimize} className="btn btn-primary">
            🎯 Run Optimization Algorithm
          </button>
        </div>
        
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>{stats.total || 0}</h3>
            <p>Total Containers</p>
          </div>
          <div className="stat-card">
            <h3>{stats.available || 0}</h3>
            <p>Available</p>
          </div>
          <div className="stat-card">
            <h3>{stats.ready || 0}</h3>
            <p>Ready for Transport</p>
          </div>
          <div className="stat-card">
            <h3>{stats.averageUtilization || '0%'}</h3>
            <p>Avg Utilization</p>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="containers-list-heading">
        <h2 id="containers-list-heading">All Containers</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Current Load</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {containers.map(container => (
                <tr key={container.id}>
                  <td><strong>#{container.id}</strong></td>
                  <td>{container.type}</td>
                  <td>{container.capacity} kg</td>
                  <td>{container.current_load} kg</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(container.current_load / container.capacity * 100)}%`,
                          height: '100%',
                          backgroundColor: '#2563eb'
                        }}></div>
                      </div>
                      <span style={{fontSize: '0.875rem', minWidth: '50px'}}>
                        {((container.current_load / container.capacity * 100).toFixed(1))}%
                      </span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${container.status === 'Available' ? 'success' : 'primary'}`}>{container.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// Tab 3: Fleet Management
function FleetTab({ data, setMessage }) {
  const fleet = data.fleet || [];
  const stats = data.stats || {};
  const [expenseCalc, setExpenseCalc] = useState({ vehicleId: '', distance: '', result: null });

  const handleCalculateExpense = async () => {
    try {
      const response = await fleetAPI.calculateExpense({
        vehicleId: expenseCalc.vehicleId,
        distance: parseFloat(expenseCalc.distance)
      });
      setExpenseCalc({ ...expenseCalc, result: response.data.expense });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to calculate expense' });
    }
  };

  return (
    <>
      <section className="card" aria-labelledby="fleet-stats-heading">
        <h2 id="fleet-stats-heading">Fleet Overview</h2>
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>{stats.total || 0}</h3>
            <p>Total Vehicles</p>
          </div>
          <div className="stat-card">
            <h3>{stats.ships || 0}</h3>
            <p>Ships</p>
          </div>
          <div className="stat-card">
            <h3>{stats.trucks || 0}</h3>
            <p>Trucks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.available || 0}</h3>
            <p>Available</p>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="fleet-list-heading">
        <h2 id="fleet-list-heading">All Vehicles</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Fuel Cost/km</th>
                <th>Crew Cost</th>
                <th>Maintenance</th>
                <th>Total Base Expense</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map(vehicle => (
                <tr key={vehicle.id}>
                  <td><strong>{vehicle.id}</strong></td>
                  <td>{vehicle.type}</td>
                  <td><strong>{vehicle.name}</strong></td>
                  <td>{vehicle.capacity.toLocaleString()} kg</td>
                  <td>₺{vehicle.fuel_cost_per_km}</td>
                  <td>₺{vehicle.crew_cost.toLocaleString()}</td>
                  <td>₺{vehicle.maintenance.toLocaleString()}</td>
                  <td>₺{vehicle.total_expense.toLocaleString()}</td>
                  <td><span className={`badge badge-${vehicle.status === 'Available' ? 'success' : 'warning'}`}>{vehicle.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" aria-labelledby="expense-calc-heading">
        <h2 id="expense-calc-heading">Trip Expense Calculator</h2>
        <p style={{color: 'var(--text-light)', marginBottom: '1rem'}}>
          Formula: Trip Expense = (Fuel Cost/km × Distance) + Crew/Driver + Maintenance
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vehicle</label>
            <select
              className="form-select"
              value={expenseCalc.vehicleId}
              onChange={(e) => setExpenseCalc({ ...expenseCalc, vehicleId: e.target.value, result: null })}
            >
              <option value="">Select Vehicle</option>
              {fleet.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Distance (km)</label>
            <input
              type="number"
              className="form-input"
              value={expenseCalc.distance}
              onChange={(e) => setExpenseCalc({ ...expenseCalc, distance: e.target.value, result: null })}
              placeholder="e.g., 3000"
            />
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <button onClick={handleCalculateExpense} className="btn btn-primary" disabled={!expenseCalc.vehicleId || !expenseCalc.distance}>
              Calculate
            </button>
          </div>
        </div>

        {expenseCalc.result && (
          <div className="alert alert-info" style={{marginTop: '1rem'}}>
            <h3>{expenseCalc.result.vehicleName} Trip Expense</h3>
            <p><strong>Calculation:</strong> {expenseCalc.result.breakdown}</p>
            <p style={{fontSize: '1.5rem', marginTop: '1rem'}}>
              <strong>Total: ₺{expenseCalc.result.totalExpense.toLocaleString('tr-TR')}</strong>
            </p>
          </div>
        )}
      </section>
    </>
  );
}

// Tab 4: Financials
function FinancialsTab({ data, setMessage, reload }) {
  const financial = data.financial?.financial || {};
  const breakdown = data.financial?.breakdown || {};

  const handleRecalculate = async () => {
    try {
      await financialAPI.recalculate();
      setMessage({ type: 'success', text: 'Financials recalculated successfully' });
      reload();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to recalculate financials' });
    }
  };

  return (
    <>
      <section className="card" aria-labelledby="financial-summary-heading">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 id="financial-summary-heading">Financial Summary</h2>
          <button onClick={handleRecalculate} className="btn btn-secondary">
            🔄 Recalculate from Shipments
          </button>
        </div>
        
        <div className="dashboard-grid">
          <div className="stat-card" style={{borderLeftColor: 'var(--secondary-color)'}}>
            <h3 style={{color: 'var(--secondary-color)'}}>₺{financial.totalRevenue?.toLocaleString('tr-TR') || 0}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-card" style={{borderLeftColor: 'var(--danger-color)'}}>
            <h3 style={{color: 'var(--danger-color)'}}>₺{financial.totalExpenses?.toLocaleString('tr-TR') || 0}</h3>
            <p>Total Expenses</p>
          </div>
          <div className="stat-card" style={{borderLeftColor: 'var(--primary-color)'}}>
            <h3 style={{color: 'var(--primary-color)'}}>₺{financial.netIncome?.toLocaleString('tr-TR') || 0}</h3>
            <p>Net Income</p>
          </div>
          <div className="stat-card" style={{borderLeftColor: 'var(--warning-color)'}}>
            <h3 style={{color: 'var(--warning-color)'}}>₺{financial.tax?.toLocaleString('tr-TR') || 0}</h3>
            <p>Tax (20%)</p>
          </div>
        </div>

        <div className="alert alert-success" style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Profit After Tax</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold'}}>
            ₺{financial.profitAfterTax?.toLocaleString('tr-TR') || 0}
          </p>
        </div>
      </section>

      <section className="card" aria-labelledby="financial-breakdown-heading">
        <h2 id="financial-breakdown-heading">Detailed Breakdown</h2>
        <div className="table-container">
          <table>
            <tbody>
              <tr>
                <td><strong>Total Revenue</strong></td>
                <td className="text-right">{breakdown.totalRevenue || '₺0'}</td>
              </tr>
              <tr>
                <td><strong>Total Expenses</strong></td>
                <td className="text-right">{breakdown.totalExpenses || '₺0'}</td>
              </tr>
              <tr style={{borderTop: '2px solid var(--border-color)'}}>
                <td><strong>Net Income</strong></td>
                <td className="text-right"><strong>{breakdown.netIncome || '₺0'}</strong></td>
              </tr>
              <tr>
                <td><strong>Tax</strong></td>
                <td className="text-right">{breakdown.tax || '₺0 (20%)'}</td>
              </tr>
              <tr style={{borderTop: '2px solid var(--border-color)', backgroundColor: '#d1fae5'}}>
                <td><strong>Profit After Tax</strong></td>
                <td className="text-right"><strong>{breakdown.profitAfterTax || '₺0'}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// Tab 5: Inventory
function InventoryTab({ data, setMessage, reload }) {
  const inventory = data.inventory || [];
  const alerts = data.alerts || [];
  const [restockData, setRestockData] = useState({ category: '', quantity: '' });

  const handleRestock = async () => {
    try {
      await inventoryAPI.restock(restockData.category, parseFloat(restockData.quantity));
      setMessage({ type: 'success', text: `Successfully restocked ${restockData.quantity} kg of ${restockData.category}` });
      setRestockData({ category: '', quantity: '' });
      reload();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to restock inventory' });
    }
  };

  return (
    <>
      {alerts.length > 0 && (
        <div className="alert alert-warning" role="alert" aria-labelledby="inventory-alerts-heading">
          <h3 id="inventory-alerts-heading">⚠️ Low Stock Alerts</h3>
          {alerts.map((alert, index) => (
            <p key={index}>{alert.message}</p>
          ))}
        </div>
      )}

      <section className="card" aria-labelledby="inventory-heading">
        <h2 id="inventory-heading">Blueberry Inventory</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>% of Minimum</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.category} Blueberries</strong></td>
                  <td>{item.quantity} kg</td>
                  <td>{item.min_stock} kg</td>
                  <td>
                    <span className={`badge badge-${item.status === 'OK' ? 'success' : 'warning'}`}>
                      {item.status === 'OK' ? '✅ OK' : '⚠️ Low'}
                    </span>
                  </td>
                  <td>{((item.quantity / item.min_stock) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" aria-labelledby="restock-heading">
        <h2 id="restock-heading">Restock Inventory</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={restockData.category}
              onChange={(e) => setRestockData({ ...restockData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {inventory.map(item => (
                <option key={item.category} value={item.category}>{item.category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantity (kg)</label>
            <input
              type="number"
              className="form-input"
              value={restockData.quantity}
              onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })}
              placeholder="e.g., 1000"
            />
          </div>
          
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <button onClick={handleRestock} className="btn btn-primary" disabled={!restockData.category || !restockData.quantity}>
              Restock
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// Tab 6: Reports
function ReportsTab({ data }) {
  const report = data.report || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <section className="card" aria-labelledby="report-heading">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 id="report-heading">Comprehensive Business Report</h2>
          <button onClick={handlePrint} className="btn btn-secondary">
            🖨️ Print Report
          </button>
        </div>
        
        <p style={{color: 'var(--text-light)'}}>
          Generated: {report.generatedAt ? new Date(report.generatedAt).toLocaleString('tr-TR') : 'N/A'}
        </p>
      </section>

      {report.financial && (
        <section className="card" aria-labelledby="report-financial-heading">
          <h2 id="report-financial-heading">📊 Financial Performance</h2>
          <div className="table-container">
            <table>
              <tbody>
                <tr><td>Total Revenue</td><td>₺{report.financial.totalRevenue?.toLocaleString('tr-TR')}</td></tr>
                <tr><td>Fleet Expense</td><td>₺{report.financial.totalFleetExpense?.toLocaleString('tr-TR')}</td></tr>
                <tr><td>Other Expenses</td><td>₺{report.financial.otherExpenses?.toLocaleString('tr-TR')}</td></tr>
                <tr><td><strong>Net Income</strong></td><td><strong>₺{report.financial.netIncome?.toLocaleString('tr-TR')}</strong></td></tr>
                <tr><td>Tax (20%)</td><td>₺{report.financial.tax?.toLocaleString('tr-TR')}</td></tr>
                <tr style={{backgroundColor: '#d1fae5'}}><td><strong>Profit After Tax</strong></td><td><strong>₺{report.financial.profitAfterTax?.toLocaleString('tr-TR')}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {report.shipments && (
        <section className="card" aria-labelledby="report-shipments-heading">
          <h2 id="report-shipments-heading">📦 Shipment Statistics</h2>
          <div className="dashboard-grid">
            <div className="stat-card"><h3>{report.shipments.total}</h3><p>Total Shipments</p></div>
            <div className="stat-card"><h3>{report.shipments.pending}</h3><p>Pending</p></div>
            <div className="stat-card"><h3>{report.shipments.inTransit}</h3><p>In Transit</p></div>
            <div className="stat-card"><h3>{report.shipments.delivered}</h3><p>Delivered</p></div>
          </div>
        </section>
      )}

      {report.routes && (
        <section className="card" aria-labelledby="report-routes-heading">
          <h2 id="report-routes-heading">🌍 Route Analytics</h2>
          <p><strong>Most Popular Route:</strong> {report.routes.mostPopularRoute}</p>
          <p><strong>Total Distance Covered:</strong> {report.routes.totalDistanceCovered}</p>
        </section>
      )}

      {report.containers && (
        <section className="card" aria-labelledby="report-containers-heading">
          <h2 id="report-containers-heading">🚚 Container Utilization</h2>
          <p><strong>Average Utilization:</strong> {report.containers.averageUtilization}</p>
          <p><strong>Total Containers:</strong> {report.containers.total}</p>
        </section>
      )}
    </>
  );
}

export default AdminDashboard;

