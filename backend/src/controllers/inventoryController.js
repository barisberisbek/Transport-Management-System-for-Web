const { findAll, findOne, update } = require('../config/dataStore');

/**
 * Get all inventory - Module 5: Inventory Management
 * CRITICAL: Must show alerts when quantity < min_stock
 */
async function getAllInventory(req, res) {
    try {
        const inventory = findAll('inventory');
        
        // Generate alerts for low stock items
        const alerts = [];
        for (const item of inventory) {
            if (item.quantity < item.min_stock) {
                alerts.push({
                    category: item.category,
                    message: `⚠️ "${item.category} blueberries stock running low — please restock."`,
                    currentStock: item.quantity,
                    minimumStock: item.min_stock,
                    deficit: item.min_stock - item.quantity
                });
            }
        }
        
        const stats = {
            totalCategories: inventory.length,
            totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
            lowStockItems: alerts.length
        };
        
        res.json({ 
            inventory,
            alerts,
            stats
        });
        
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Failed to get inventory' });
    }
}

/**
 * Restock inventory (Admin convenience function)
 */
async function restockInventory(req, res) {
    try {
        const { category } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }
        
        const item = findOne('inventory', i => i.category === category);
        
        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        
        const newQuantity = item.quantity + quantity;
        const updated = update('inventory', i => i.category === category, {
            quantity: newQuantity,
            status: newQuantity >= item.min_stock ? 'OK' : 'Low',
            last_updated: new Date().toISOString()
        });
        
        res.json({
            message: `Successfully restocked ${quantity} kg of ${category} blueberries`,
            inventory: updated
        });
        
    } catch (error) {
        console.error('Restock error:', error);
        res.status(500).json({ error: 'Failed to restock inventory' });
    }
}

/**
 * Get inventory by category
 */
async function getInventoryByCategory(req, res) {
    try {
        const { category } = req.params;
        
        const item = findOne('inventory', i => i.category === category);
        
        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        
        const alert = item.quantity < item.min_stock 
            ? `⚠️ "${category} blueberries stock running low — please restock."`
            : null;
        
        res.json({
            inventory: item,
            alert,
            stockLevel: item.quantity >= item.min_stock ? 'OK' : 'Low',
            percentOfMinimum: ((item.quantity / item.min_stock) * 100).toFixed(2) + '%'
        });
        
    } catch (error) {
        console.error('Get inventory item error:', error);
        res.status(500).json({ error: 'Failed to get inventory item' });
    }
}

module.exports = {
    getAllInventory,
    restockInventory,
    getInventoryByCategory
};

