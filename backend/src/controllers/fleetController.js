const { findAll, findOne } = require('../config/dataStore');
const { calculateTripExpense } = require('../utils/fleetCalculator');

/**
 * Get all fleet vehicles - Module 3: Fleet Management
 */
async function getAllFleet(req, res) {
    try {
        const fleet = findAll('fleet');
        
        const stats = {
            total: fleet.length,
            ships: fleet.filter(v => v.type === 'Ship').length,
            trucks: fleet.filter(v => v.type === 'Truck').length,
            available: fleet.filter(v => v.status === 'Available').length,
            inUse: fleet.filter(v => v.status === 'In Use').length
        };
        
        res.json({ fleet, stats });
        
    } catch (error) {
        console.error('Get fleet error:', error);
        res.status(500).json({ error: 'Failed to get fleet' });
    }
}

/**
 * Calculate trip expense for a vehicle
 * CRITICAL FORMULA: Trip Expense = (Fuel Cost/km × Distance) + Crew/Driver + Maintenance
 */
async function calculateExpense(req, res) {
    try {
        const { vehicleId, distance } = req.body;
        
        if (!vehicleId || !distance) {
            return res.status(400).json({ error: 'Vehicle ID and distance are required' });
        }
        
        const vehicle = findOne('fleet', v => v.id === vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        // Calculate using EXACT formula from documentation
        const expense = calculateTripExpense(vehicle, distance);
        
        res.json({
            success: true,
            expense,
            formula: `Trip Expense = (Fuel Cost/km × Distance) + Crew/Driver + Maintenance`,
            calculation: expense.breakdown
        });
        
    } catch (error) {
        console.error('Calculate expense error:', error);
        res.status(500).json({ error: 'Failed to calculate expense' });
    }
}

/**
 * Get vehicle by ID
 */
async function getVehicleById(req, res) {
    try {
        const { id } = req.params;
        
        const vehicle = findOne('fleet', v => v.id === id);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json({ vehicle });
        
    } catch (error) {
        console.error('Get vehicle error:', error);
        res.status(500).json({ error: 'Failed to get vehicle' });
    }
}

module.exports = {
    getAllFleet,
    calculateExpense,
    getVehicleById
};

