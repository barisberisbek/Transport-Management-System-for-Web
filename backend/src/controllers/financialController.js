const { getFinancials, updateFinancials, findAll } = require('../config/dataStore');
const { calculateFinancials } = require('../utils/financialCalculator');

/**
 * Get financial summary - Module 4: Financials
 * CRITICAL: Tax must be exactly 20% of Net Income
 */
async function getFinancialSummary(req, res) {
    try {
        // Gather revenue from delivered shipments
        const shipments = findAll('shipments', s => s.status === 'Delivered');
        const totalShipments = shipments.length;
        const totalRevenue = shipments.reduce((sum, s) => sum + s.price, 0);
        const averageRevenue = totalShipments > 0 ? (totalRevenue / totalShipments) : 0;

        // Gather expenses from logged fleet trips
        const fleetTrips = findAll('fleet_trips');
        const totalExpenses = fleetTrips.reduce((sum, trip) => sum + (trip.total_expense || 0), 0);
        const totalDistance = fleetTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0);

        // Calculate full financials and persist snapshot
        const calculated = calculateFinancials(totalRevenue, totalExpenses);
        const persisted = updateFinancials({
            total_revenue: totalRevenue,
            total_expenses: totalExpenses,
            net_income: calculated.netIncome,
            tax: calculated.tax,
            profit_after_tax: calculated.profitAfterTax,
            totalRevenue: calculated.totalRevenue,
            totalExpenses: calculated.totalExpenses,
            netIncome: calculated.netIncome,
            profitAfterTax: calculated.profitAfterTax,
            taxRate: calculated.taxRate
        });
        
        const generatedAt = new Date().toISOString();
        const financialSnapshot = {
            ...calculated,
            generatedAt,
            lastUpdated: persisted.updated_at
        };
        
        res.json({
            financial: financialSnapshot,
            breakdown: {
                totalRevenue: `₺${calculated.totalRevenue.toLocaleString('tr-TR')}`,
                totalExpenses: `₺${calculated.totalExpenses.toLocaleString('tr-TR')}`,
                netIncome: `₺${calculated.netIncome.toLocaleString('tr-TR')}`,
                tax: `₺${calculated.tax.toLocaleString('tr-TR')} (${calculated.taxRate})`,
                profitAfterTax: `₺${calculated.profitAfterTax.toLocaleString('tr-TR')}`
            },
            stats: {
                totalShipments,
                deliveredShipments: totalShipments,
                averageRevenuePerShipment: averageRevenue.toFixed(2),
                fleetTrips: fleetTrips.length,
                totalTripExpense: `₺${totalExpenses.toLocaleString('tr-TR')}`,
                totalTripDistance: `${totalDistance.toLocaleString('tr-TR')} km`,
                generatedAt,
                lastUpdated: persisted.updated_at
            }
        });
        
    } catch (error) {
        console.error('Get financial summary error:', error);
        res.status(500).json({ error: 'Failed to get financial summary' });
    }
}

/**
 * Recalculate all financials from shipments
 */
async function recalculateFinancials(req, res) {
    try {
        // Calculate total revenue from delivered shipments
        const shipments = findAll('shipments', s => s.status === 'Delivered');
        const totalRevenue = shipments.reduce((sum, s) => sum + s.price, 0);
        
        // Calculate total expenses from logged fleet trips
        const fleetTrips = findAll('fleet_trips');
        const totalExpenses = fleetTrips.reduce((sum, trip) => sum + (trip.total_expense || 0), 0);
        
        const calculated = calculateFinancials(totalRevenue, totalExpenses);
        
        // Update database snapshot
        const persisted = updateFinancials({
            total_revenue: totalRevenue,
            total_expenses: totalExpenses,
            net_income: calculated.netIncome,
            tax: calculated.tax,
            profit_after_tax: calculated.profitAfterTax,
            totalRevenue: calculated.totalRevenue,
            totalExpenses: calculated.totalExpenses,
            netIncome: calculated.netIncome,
            profitAfterTax: calculated.profitAfterTax,
            taxRate: calculated.taxRate
        });
        
        const generatedAt = new Date().toISOString();
        
        res.json({
            message: 'Financials recalculated successfully',
            financial: {
                ...calculated,
                generatedAt,
                lastUpdated: persisted.updated_at
            },
            source: {
                deliveredShipments: shipments.length,
                totalRevenue,
                totalExpenses,
                fleetTrips: fleetTrips.length,
                generatedAt,
                lastUpdated: persisted.updated_at
            }
        });
        
    } catch (error) {
        console.error('Recalculate financials error:', error);
        res.status(500).json({ error: 'Failed to recalculate financials' });
    }
}

module.exports = {
    getFinancialSummary,
    recalculateFinancials
};

