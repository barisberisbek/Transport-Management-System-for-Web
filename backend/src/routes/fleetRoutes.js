const express = require('express');
const router = express.Router();
const {
    getAllFleet,
    calculateExpense,
    getVehicleById
} = require('../controllers/fleetController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All fleet routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/', getAllFleet);
router.get('/:id', getVehicleById);
router.post('/calculate-expense', calculateExpense);

module.exports = router;

