const express = require('express');
const router = express.Router();
const {
    getAllInventory,
    getInventoryByCategory,
    restockInventory
} = require('../controllers/inventoryController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All inventory routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/', getAllInventory);
router.get('/:category', getInventoryByCategory);
router.post('/:category/restock', restockInventory);

module.exports = router;

