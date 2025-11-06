// Price Calculator - Strictly as per documentation
// Formula: Total Price = Distance × Rate per km (based on container type)

// Container specifications (exactly as per documentation)
const CONTAINER_SPECS = {
    'Small': {
        capacity: 2000, // kg
        pricePerKm: 5    // ₺/km
    },
    'Medium': {
        capacity: 5000,
        pricePerKm: 8
    },
    'Large': {
        capacity: 10000,
        pricePerKm: 12
    }
};

/**
 * Calculate shipment price
 * @param {number} distance - Distance in kilometers
 * @param {string} containerType - 'Small', 'Medium', or 'Large'
 * @returns {number} - Total price in Turkish Lira (₺)
 */
function calculatePrice(distance, containerType) {
    const specs = CONTAINER_SPECS[containerType];
    
    if (!specs) {
        throw new Error(`Invalid container type: ${containerType}`);
    }
    
    // Exact formula from documentation
    const totalPrice = distance * specs.pricePerKm;
    
    return totalPrice;
}

/**
 * Check if weight fits in container type
 * @param {number} weight - Weight in kg
 * @param {string} containerType - Container type
 * @returns {boolean}
 */
function checkCapacity(weight, containerType) {
    const specs = CONTAINER_SPECS[containerType];
    return weight <= specs.capacity;
}

/**
 * Get container specifications
 * @param {string} containerType 
 * @returns {object}
 */
function getContainerSpecs(containerType) {
    return CONTAINER_SPECS[containerType];
}

module.exports = {
    calculatePrice,
    checkCapacity,
    getContainerSpecs,
    CONTAINER_SPECS
};

