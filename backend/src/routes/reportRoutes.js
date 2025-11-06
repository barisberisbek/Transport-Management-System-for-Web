const express = require('express');
const router = express.Router();
const {
    generateReport
} = require('../controllers/reportController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All report routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/generate', generateReport);

module.exports = router;

