const express = require('express');
const router = express.Router();
const {
    getAllFleet,
    calculateExpense,
    getVehicleById,
    getTripLogs
} = require('../controllers/fleetController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All fleet routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/', getAllFleet);
router.get('/trips/logs', getTripLogs);
router.post('/calculate-expense', calculateExpense);
router.get('/:id', getVehicleById);

module.exports = router;

