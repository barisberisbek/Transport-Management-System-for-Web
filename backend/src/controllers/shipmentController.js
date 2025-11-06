const { findOne, findAll, insert, update } = require('../config/dataStore');
const { calculateDistance, estimateDeliveryTime } = require('../utils/distanceCalculator');
const { calculatePrice, checkCapacity } = require('../utils/priceCalculator');

/**
 * Create new shipment - Module 1: Customer Interface
 * CRITICAL: Price formula must be exact: Total Price = Distance × Rate per km
 */
async function createShipment(req, res) {
    try {
        const {
            product_name,
            category,
            weight,
            destination,
            destination_country,
            container_type
        } = req.body;
        
        const customer_id = req.user.id;
        const customer_name = req.user.username;
        
        // Validation
        if (!product_name || !category || !weight || !destination || !container_type) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (!['Fresh', 'Frozen', 'Organic'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        if (!['Small', 'Medium', 'Large'].includes(container_type)) {
            return res.status(400).json({ error: 'Invalid container type' });
        }
        
        // Check capacity
        if (!checkCapacity(weight, container_type)) {
            return res.status(400).json({ 
                error: `Weight exceeds ${container_type} container capacity`,
                alert: `There is no enough space in ${container_type} container`
            });
        }
        
        // Check inventory
        const inventory = findOne('inventory', i => i.category === category);
        
        if (!inventory || inventory.quantity < weight) {
            return res.status(400).json({ 
                error: `Insufficient inventory for ${category}. Available: ${inventory?.quantity || 0} kg` 
            });
        }
        
        // Calculate distance from Muğla
        const distance = calculateDistance(destination);
        
        // Calculate price - EXACT FORMULA
        const price = calculatePrice(distance, container_type);
        
        // Estimate delivery time
        const estimated_delivery_days = estimateDeliveryTime(distance, container_type);
        
        // Create shipment
        const shipment = insert('shipments', {
            customer_name,
            customer_id,
            product_name,
            category,
            weight,
            destination,
            destination_country: destination_country || destination.split(',').pop().trim(),
            distance,
            container_type,
            price,
            estimated_delivery_days,
            status: 'Pending',
            container_id: null,
            created_at: new Date().toISOString()
        });
        
        // Update inventory
        update('inventory', i => i.category === category, {
            quantity: inventory.quantity - weight,
            status: (inventory.quantity - weight) < inventory.min_stock ? 'Low' : 'OK',
            last_updated: new Date().toISOString()
        });
        
        res.status(201).json({
            message: 'Shipment created successfully',
            shipment,
            priceBreakdown: {
                distance: `${distance} km`,
                containerType: container_type,
                ratePerKm: `₺${price / distance}`,
                totalPrice: `₺${price}`,
                formula: `${distance} km × ₺${price / distance}/km = ₺${price}`,
                estimatedDelivery: `${estimated_delivery_days} days`
            }
        });
        
    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
}

/**
 * Track shipment by ID
 */
async function trackShipment(req, res) {
    try {
        const { id } = req.params;
        
        const shipment = findOne('shipments', s => s.id == id);
        
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        // Get container info if assigned
        let containerInfo = null;
        if (shipment.container_id) {
            containerInfo = findOne('containers', c => c.id === shipment.container_id);
        }
        
        const statusLocations = {
            'Pending': 'Muğla Warehouse',
            'Ready': 'Loading Dock',
            'In Transit': 'En Route',
            'Delivered': 'Destination'
        };
        
        res.json({
            shipment,
            container: containerInfo,
            tracking: {
                orderId: shipment.id,
                status: shipment.status,
                destination: shipment.destination,
                estimatedDelivery: `${shipment.estimated_delivery_days} days`,
                currentLocation: statusLocations[shipment.status] || 'Unknown'
            }
        });
        
    } catch (error) {
        console.error('Track shipment error:', error);
        res.status(500).json({ error: 'Failed to track shipment' });
    }
}

/**
 * Get all shipments (Admin)
 */
async function getAllShipments(req, res) {
    try {
        const { status } = req.query;
        
        let shipments;
        if (status) {
            shipments = findAll('shipments', s => s.status === status);
        } else {
            shipments = findAll('shipments');
        }
        
        // Sort by created_at descending
        shipments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json({ shipments, count: shipments.length });
        
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({ error: 'Failed to get shipments' });
    }
}

/**
 * Get customer's shipments
 */
async function getCustomerShipments(req, res) {
    try {
        const customerId = req.user.id;
        
        const shipments = findAll('shipments', s => s.customer_id === customerId);
        shipments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json({ shipments, count: shipments.length });
        
    } catch (error) {
        console.error('Get customer shipments error:', error);
        res.status(500).json({ error: 'Failed to get shipments' });
    }
}

/**
 * Update shipment status (Admin)
 */
async function updateShipmentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['Pending', 'Ready', 'In Transit', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const shipment = update('shipments', s => s.id == id, { status });
        
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        res.json({ message: 'Status updated', shipment });
        
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
}

module.exports = {
    createShipment,
    trackShipment,
    getAllShipments,
    getCustomerShipments,
    updateShipmentStatus
};

