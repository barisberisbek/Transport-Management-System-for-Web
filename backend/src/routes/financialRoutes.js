const express = require('express');
const router = express.Router();
const {
    getFinancialSummary,
    recalculateFinancials
} = require('../controllers/financialController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All financial routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/summary', getFinancialSummary);
router.post('/recalculate', recalculateFinancials);

module.exports = router;

