const express = require('express');
const router = express.Router();
const {
    getAllContainers,
    optimizeContainersRoute,
    getContainerById
} = require('../controllers/containerController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All container routes require admin access
router.use(authenticateToken, requireAdmin);

router.get('/', getAllContainers);
router.get('/:id', getContainerById);
router.post('/optimize', optimizeContainersRoute);

module.exports = router;

