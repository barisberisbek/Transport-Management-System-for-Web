// Financial Calculator
// Tax rate: 20% (exactly as per documentation)

const TAX_RATE = 0.20; // 20% as specified

/**
 * Calculate financial summary
 * @param {number} totalRevenue - Total revenue from shipments
 * @param {number} totalExpenses - Total expenses (fleet + other)
 * @returns {Object} - Complete financial breakdown
 */
function calculateFinancials(totalRevenue, totalExpenses) {
    // Calculate net income
    const netIncome = totalRevenue - totalExpenses;
    
    // Calculate tax (20% of net income) - exactly as per documentation
    const tax = netIncome > 0 ? netIncome * TAX_RATE : 0;
    
    // Calculate profit after tax
    const profitAfterTax = netIncome - tax;
    
    return {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netIncome: parseFloat(netIncome.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        taxRate: `${TAX_RATE * 100}%`,
        profitAfterTax: parseFloat(profitAfterTax.toFixed(2))
    };
}

/**
 * Update financial record with new transaction
 * @param {Object} currentFinancials - Current financial state
 * @param {number} revenue - New revenue to add
 * @param {number} expense - New expense to add
 * @returns {Object} - Updated financials
 */
function updateFinancials(currentFinancials, revenue = 0, expense = 0) {
    const newRevenue = currentFinancials.total_revenue + revenue;
    const newExpenses = currentFinancials.total_expenses + expense;
    
    return calculateFinancials(newRevenue, newExpenses);
}

/**
 * Format currency for display
 * @param {number} amount 
 * @returns {string}
 */
function formatCurrency(amount) {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

module.exports = {
    calculateFinancials,
    updateFinancials,
    formatCurrency,
    TAX_RATE
};

