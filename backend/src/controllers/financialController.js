const { getFinancials, updateFinancials, findAll } = require('../config/dataStore');
const { calculateFinancials } = require('../utils/financialCalculator');

/**
 * Get financial summary - Module 4: Financials
 * CRITICAL: Tax must be exactly 20% of Net Income
 */
async function getFinancialSummary(req, res) {
    try {
        // Get current financial record
        const financial = getFinancials();
        
        // Recalculate to ensure accuracy
        const calculated = calculateFinancials(financial.total_revenue, financial.total_expenses);
        
        // Get breakdown
        const shipments = findAll('shipments', s => s.status === 'Delivered');
        const totalShipments = shipments.length;
        const revenue = shipments.reduce((sum, s) => sum + s.price, 0);
        
        res.json({
            financial: calculated,
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
                averageRevenuePerShipment: totalShipments > 0 ? (revenue / totalShipments).toFixed(2) : 0
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
        
        // For now, use simplified expense calculation
        const totalExpenses = 0; // Will be calculated from actual fleet usage
        
        const calculated = calculateFinancials(totalRevenue, totalExpenses);
        
        // Update database
        updateFinancials(calculated);
        
        res.json({
            message: 'Financials recalculated successfully',
            financial: calculated,
            source: {
                deliveredShipments: shipments.length,
                totalRevenue
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

