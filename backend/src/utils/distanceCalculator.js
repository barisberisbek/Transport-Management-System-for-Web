// Distance Calculator - Simulates Google Maps API
// Base location: Muğla, Turkey
// All distances in kilometers

const distances = {
    // Domestic (Turkey)
    'Istanbul, Turkey': 650,
    'Ankara, Turkey': 520,
    'Izmir, Turkey': 120,
    'Antalya, Turkey': 200,
    'Bodrum, Turkey': 60,
    
    // Europe
    'Berlin, Germany': 3000,
    'Paris, France': 3200,
    'London, UK': 3500,
    'Rome, Italy': 2100,
    'Madrid, Spain': 3800,
    'Amsterdam, Netherlands': 3300,
    'Vienna, Austria': 2400,
    'Athens, Greece': 800,
    'Sofia, Bulgaria': 1100,
    'Bucharest, Romania': 1400,
    
    // Middle East
    'Dubai, UAE': 3400,
    'Tel Aviv, Israel': 1200,
    'Cairo, Egypt': 1500,
    'Beirut, Lebanon': 1000,
    'Riyadh, Saudi Arabia': 2800,
    
    // Asia
    'Mumbai, India': 5500,
    'Shanghai, China': 8500,
    'Tokyo, Japan': 9800,
    'Singapore, Singapore': 9200,
    'Bangkok, Thailand': 7800,
    
    // North America
    'New York, USA': 9500,
    'Los Angeles, USA': 12000,
    'Chicago, USA': 9800,
    'Toronto, Canada': 9200,
    'Mexico City, Mexico': 11500
};

/**
 * Calculate distance from Muğla to destination
 * @param {string} destination - City, Country format
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(destination) {
    // Exact match
    if (distances[destination]) {
        return distances[destination];
    }
    
    // Try case-insensitive match
    const lowerDest = destination.toLowerCase();
    for (const [key, value] of Object.entries(distances)) {
        if (key.toLowerCase() === lowerDest) {
            return value;
        }
    }
    
    // Extract country and estimate by region
    const country = destination.split(',').pop().trim().toLowerCase();
    
    if (country.includes('turkey')) return 300; // Average domestic
    if (country.includes('germany') || country.includes('france') || country.includes('netherlands')) return 3000;
    if (country.includes('uk') || country.includes('england')) return 3500;
    if (country.includes('spain') || country.includes('portugal')) return 3800;
    if (country.includes('italy')) return 2100;
    if (country.includes('greece')) return 800;
    if (country.includes('egypt')) return 1500;
    if (country.includes('uae') || country.includes('emirates')) return 3400;
    if (country.includes('india')) return 5500;
    if (country.includes('china')) return 8500;
    if (country.includes('japan')) return 9800;
    if (country.includes('usa') || country.includes('united states')) return 10000;
    if (country.includes('canada')) return 9200;
    
    // Default for unknown destinations (average international)
    return 3000;
}

/**
 * Get estimated delivery time based on distance
 * @param {number} distance - Distance in km
 * @param {string} containerType - Small, Medium, or Large
 * @returns {number} - Estimated delivery days
 */
function estimateDeliveryTime(distance, containerType) {
    // Base calculation: 500 km per day on average
    let days = Math.ceil(distance / 500);
    
    // Add processing time based on container
    const processingDays = {
        'Small': 1,
        'Medium': 2,
        'Large': 3
    };
    
    days += processingDays[containerType] || 2;
    
    return days;
}

module.exports = {
    calculateDistance,
    estimateDeliveryTime,
    getAllDestinations: () => Object.keys(distances).sort()
};

