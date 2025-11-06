const express = require('express');
const router = express.Router();
const {
    createShipment,
    trackShipment,
    getAllShipments,
    getCustomerShipments,
    updateShipmentStatus
} = require('../controllers/shipmentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Customer routes
router.post('/create', authenticateToken, createShipment);
router.get('/my-shipments', authenticateToken, getCustomerShipments);
router.get('/track/:id', trackShipment); // Public tracking

// Admin routes
router.get('/all', authenticateToken, requireAdmin, getAllShipments);
router.patch('/:id/status', authenticateToken, requireAdmin, updateShipmentStatus);

module.exports = router;

