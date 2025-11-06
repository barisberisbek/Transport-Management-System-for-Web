const { getFinancials, findAll } = require('../config/dataStore');
const { calculateUtilization } = require('../utils/containerOptimizer');

/**
 * Generate comprehensive report - Module 6: Reports
 */
async function generateReport(req, res) {
    try {
        // Financial data
        const financial = getFinancials();
        
        // Shipment data
        const allShipments = findAll('shipments');
        const deliveredShipments = allShipments.filter(s => s.status === 'Delivered');
        
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
        const totalDistance = allShipments.reduce((sum, s) => sum + s.distance, 0);
        
        // Products sold per category
        const categoryStats = {};
        allShipments.forEach(s => {
            if (!categoryStats[s.category]) {
                categoryStats[s.category] = { count: 0, weight: 0 };
            }
            categoryStats[s.category].count++;
            categoryStats[s.category].weight += s.weight;
        });
        
        // Inventory
        const inventory = findAll('inventory');
        
        // Fleet data
        const fleet = findAll('fleet');
        const fleetStats = {
            totalVehicles: fleet.length,
            ships: fleet.filter(v => v.type === 'Ship').length,
            trucks: fleet.filter(v => v.type === 'Truck').length,
            totalCapacity: fleet.reduce((sum, v) => sum + v.capacity, 0)
        };
        
        // Build comprehensive report
        const report = {
            generatedAt: new Date().toISOString(),
            period: 'All Time',
            
            // Financial Summary
            financial: {
                totalRevenue: financial.total_revenue,
                totalFleetExpense: financial.total_expenses,
                otherExpenses: 0,
                netIncome: financial.net_income,
                tax: financial.tax,
                taxRate: '20%',
                profitAfterTax: financial.profit_after_tax
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
                totalWeight: allShipments.reduce((sum, s) => sum + s.weight, 0) + ' kg'
            },
            
            // Remaining Inventory
            inventory: inventory.map(item => ({
                category: item.category,
                quantity: item.quantity + ' kg',
                status: item.status,
                percentOfMinimum: ((item.quantity / item.min_stock) * 100).toFixed(2) + '%'
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

