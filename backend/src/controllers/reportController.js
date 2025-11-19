const { getFinancials, findAll } = require('../config/dataStore');
const { calculateUtilization } = require('../utils/containerOptimizer');
const { calculateFinancials } = require('../utils/financialCalculator');

const toNumber = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Generate comprehensive report - Module 6: Reports
 */
async function generateReport(req, res) {
    try {
        // Shipment data
        const allShipments = findAll('shipments');
        const deliveredShipments = allShipments.filter(s => s.status === 'Delivered');
        const totalRevenue = deliveredShipments.reduce((sum, s) => sum + s.price, 0);
        
        // Container data
        const containers = findAll('containers');
        const avgUtilization = calculateUtilization(containers);
        
        // Popular routes
        const routeCounts = {};
        allShipments.forEach(s => {
            const route = `Muğla → ${s.destination}`;
            routeCounts[route] = (routeCounts[route] || 0) + 1;
        });
        
        const popularRoutes = Object.entries(routeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([route, count]) => ({ route, shipments: count }));
        
        const mostPopularRoute = popularRoutes.length > 0 ? popularRoutes[0].route : 'N/A';
        
        // Total distance
        const totalDistance = allShipments.reduce((sum, s) => sum + toNumber(s.distance), 0);
        
        // Products sold per category
        const categoryStats = {};
        const totalWeight = allShipments.reduce((sum, s) => sum + toNumber(s.weight), 0);
        allShipments.forEach(s => {
            if (!categoryStats[s.category]) {
                categoryStats[s.category] = { count: 0, weight: 0 };
            }
            const shipmentWeight = toNumber(s.weight);
            categoryStats[s.category].count++;
            categoryStats[s.category].weight += shipmentWeight;
        });
        
        // Inventory
        const inventory = findAll('inventory');
        
        // Fleet data
        const fleet = findAll('fleet');
        const fleetTrips = findAll('fleet_trips');
        const totalFleetExpense = fleetTrips.reduce((sum, trip) => sum + (trip.total_expense || 0), 0);
        const totalTripDistance = fleetTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
        const fleetStats = {
            totalVehicles: fleet.length,
            ships: fleet.filter(v => v.type === 'Ship').length,
            trucks: fleet.filter(v => v.type === 'Truck').length,
            totalCapacity: fleet.reduce((sum, v) => sum + v.capacity, 0),
            loggedTrips: fleetTrips.length,
            totalTripExpense: totalFleetExpense,
            totalTripDistance
        };
        
        // Financial summary derived from real data
        const calculatedFinancials = calculateFinancials(totalRevenue, totalFleetExpense);
        const financial = getFinancials();
        
        const generatedAt = new Date().toISOString();
        const report = {
            generatedAt,
            issuedAt: generatedAt,
            issuedAtReadable: new Date(generatedAt).toLocaleString('tr-TR'),
            period: 'All Time',
            
            // Financial Summary
            financial: {
                totalRevenue: calculatedFinancials.totalRevenue,
                totalFleetExpense: totalFleetExpense,
                otherExpenses: Math.max((financial.total_expenses || 0) - totalFleetExpense, 0),
                netIncome: calculatedFinancials.netIncome,
                tax: calculatedFinancials.tax,
                taxRate: calculatedFinancials.taxRate,
                profitAfterTax: calculatedFinancials.profitAfterTax
            },
            
            // Shipment Statistics
            shipments: {
                total: allShipments.length,
                pending: allShipments.filter(s => s.status === 'Pending').length,
                ready: allShipments.filter(s => s.status === 'Ready').length,
                inTransit: allShipments.filter(s => s.status === 'In Transit').length,
                delivered: deliveredShipments.length
            },
            
            // Container Statistics
            containers: {
                total: containers.length,
                averageUtilization: avgUtilization + '%',
                inUse: containers.filter(c => c.status !== 'Available').length,
                available: containers.filter(c => c.status === 'Available').length
            },
            
            // Route Analytics
            routes: {
                mostPopularRoute,
                popularRoutes,
                totalDistanceCovered: totalDistance + ' km'
            },
            
            // Product Statistics
            products: {
                soldPerCategory: categoryStats,
                totalWeight: totalWeight + ' kg'
            },
            
            // Remaining Inventory
            inventory: inventory.map(item => ({
                category: item.category,
                quantity: toNumber(item.quantity) + ' kg',
                status: item.status,
                percentOfMinimum: ((toNumber(item.quantity) / item.min_stock) * 100).toFixed(2) + '%'
            })),
            
            // Fleet Statistics
            fleet: fleetStats
        };
        
        res.json({
            success: true,
            report
        });
        
    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
}

module.exports = {
    generateReport
};

