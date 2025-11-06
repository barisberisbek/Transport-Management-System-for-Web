const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const containerRoutes = require('./routes/containerRoutes');
const fleetRoutes = require('./routes/fleetRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const financialRoutes = require('./routes/financialRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Transport & Management System API (JSON Store)',
        version: '1.0.0',
        dataStore: 'db.json',
        status: 'running',
        project: 'CENG 3507 Midterm Project'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin/containers', containerRoutes);
app.use('/api/admin/fleet', fleetRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/admin/financial', financialRoutes);
app.use('/api/admin/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

