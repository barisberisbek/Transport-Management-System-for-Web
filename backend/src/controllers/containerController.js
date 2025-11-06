const { findAll, update, updateMany } = require('../config/dataStore');
const { optimizeContainers, calculateUtilization } = require('../utils/containerOptimizer');

/**
 * Get all containers
 */
async function getAllContainers(req, res) {
    try {
        const containers = findAll('containers');
        
        const stats = {
            total: containers.length,
            available: containers.filter(c => c.status === 'Available').length,
            ready: containers.filter(c => c.status === 'Ready').length,
            inTransit: containers.filter(c => c.status === 'In Transit').length,
            averageUtilization: calculateUtilization(containers) + '%'
        };
        
        res.json({ containers, stats });
        
    } catch (error) {
        console.error('Get containers error:', error);
        res.status(500).json({ error: 'Failed to get containers' });
    }
}

/**
 * Optimize containers - Module 2: First-Fit Decreasing Algorithm
 * CRITICAL: Must implement bin-packing algorithm exactly as specified
 */
async function optimizeContainersRoute(req, res) {
    try {
        // Get all pending shipments
        const shipments = findAll('shipments', s => s.status === 'Pending');
        
        if (shipments.length === 0) {
            return res.status(400).json({ 
                error: 'No pending shipments to optimize',
                message: 'All shipments are already assigned or no shipments exist'
            });
        }
        
        // Get available containers
        const containers = findAll('containers', c => c.status === 'Available');
        
        if (containers.length === 0) {
            return res.status(400).json({ 
                error: 'No available containers',
                message: 'All containers are in use'
            });
        }
        
        // Run optimization algorithm
        const result = optimizeContainers(shipments, containers);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        // Update database with assignments
        for (const assignment of result.assignments) {
            // Assign container to shipment
            update('shipments', s => s.id === assignment.shipmentId, {
                container_id: assignment.containerId,
                status: 'Ready'
            });
        }
        
        // Update container loads and statuses
        for (const container of result.containers) {
            update('containers', c => c.id === container.id, {
                current_load: container.current_load,
                status: container.status
            });
        }
        
        res.json({
            success: true,
            message: result.message,
            optimization: {
                totalShipmentsAssigned: result.totalShipmentsAssigned,
                containersUsed: result.containersUsed,
                assignments: result.assignments,
                containerDetails: result.containers
            }
        });
        
    } catch (error) {
        console.error('Optimize containers error:', error);
        res.status(500).json({ error: 'Container optimization failed' });
    }
}

/**
 * Get container by ID with assigned shipments
 */
async function getContainerById(req, res) {
    try {
        const { id } = req.params;
        
        const container = findAll('containers').find(c => c.id == id);
        
        if (!container) {
            return res.status(404).json({ error: 'Container not found' });
        }
        
        const shipments = findAll('shipments', s => s.container_id == id);
        
        res.json({ 
            container,
            shipments,
            utilization: ((container.current_load / container.capacity) * 100).toFixed(2) + '%',
            remainingCapacity: container.capacity - container.current_load
        });
        
    } catch (error) {
        console.error('Get container error:', error);
        res.status(500).json({ error: 'Failed to get container' });
    }
}

module.exports = {
    getAllContainers,
    optimizeContainersRoute,
    getContainerById
};

