const { findAll, findOne, insert } = require('../config/dataStore');
const { calculateTripExpense } = require('../utils/fleetCalculator');

const toNumber = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

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
        const { vehicleId, distance, shipmentId = null, notes = '' } = req.body;
        
        if (!vehicleId || !distance) {
            return res.status(400).json({ error: 'Vehicle ID and distance are required' });
        }

        const numericDistance = toNumber(distance);
        if (!Number.isFinite(numericDistance) || numericDistance <= 0) {
            return res.status(400).json({ error: 'Distance must be a positive number' });
        }
        
        const vehicle = findOne('fleet', v => v.id === vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        // Calculate using EXACT formula from documentation
        const expense = calculateTripExpense(vehicle, numericDistance);

        // Persist trip record for financial tracking
        const trip = insert('fleet_trips', {
            vehicle_id: vehicle.id,
            vehicle_name: vehicle.name,
            vehicle_type: vehicle.type,
            distance: numericDistance,
            fuel_cost_per_km: vehicle.fuel_cost_per_km,
            crew_cost: vehicle.crew_cost,
            maintenance_cost: vehicle.maintenance,
            total_expense: expense.totalExpense,
            shipment_id: shipmentId,
            notes: notes || null,
            created_at: new Date().toISOString()
        });
        
        res.json({
            success: true,
            expense,
            trip,
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

/**
 * Get logged fleet trips for expense tracking
 */
async function getTripLogs(req, res) {
    try {
        const trips = findAll('fleet_trips');
        const orderedTrips = [...trips].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        const stats = {
            totalTrips: orderedTrips.length,
            totalDistance: orderedTrips.reduce((sum, trip) => sum + toNumber(trip.distance), 0),
            totalExpense: orderedTrips.reduce((sum, trip) => sum + toNumber(trip.total_expense), 0)
        };
        
        res.json({ trips: orderedTrips, stats });
    } catch (error) {
        console.error('Get trip logs error:', error);
        res.status(500).json({ error: 'Failed to get fleet trip logs' });
    }
}

module.exports = {
    getAllFleet,
    calculateExpense,
    getVehicleById,
    getTripLogs
};

