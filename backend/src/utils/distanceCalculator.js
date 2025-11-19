// Distance Calculator - Google Maps Distance Matrix API Simulation
// Base location: Muğla, Turkey (Company Headquarters)
// All distances in kilometers
//
// This module simulates Google Maps Distance Matrix API responses
// In production, replace with actual Google Maps API:
// const {Client} = require("@googlemaps/google-maps-services-js");
// const client = new Client({});
//
// API Response Format:
// {
//   origin: "Muğla, Turkey",
//   destination: "Berlin, Germany",  
//   distance: { value: 3000000, text: "3,000 km" },
//   duration: { value: 216000, text: "60 hours" },
//   status: "OK"
// }

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
 * Simulates Google Maps Distance Matrix API call
 * @param {string} destination - City, Country format
 * @returns {Object} - Simulated API response matching Google's format
 */
function simulateGoogleMapsAPI(destination) {
    // Get base distance from our database
    let distance = distances[destination];
    
    // If not found, try case-insensitive match
    if (!distance) {
        const lowerDest = destination.toLowerCase();
        for (const [key, value] of Object.entries(distances)) {
            if (key.toLowerCase() === lowerDest) {
                distance = value;
                break;
            }
        }
    }
    
    // If still not found, estimate by country
    if (!distance) {
        const country = destination.split(',').pop().trim().toLowerCase();
        
        if (country.includes('turkey')) distance = 300;
        else if (country.includes('germany') || country.includes('france')) distance = 3000;
        else if (country.includes('uk') || country.includes('england')) distance = 3500;
        else if (country.includes('spain') || country.includes('portugal')) distance = 3800;
        else if (country.includes('italy')) distance = 2100;
        else if (country.includes('greece')) distance = 800;
        else if (country.includes('egypt')) distance = 1500;
        else if (country.includes('uae') || country.includes('emirates')) distance = 3400;
        else if (country.includes('india')) distance = 5500;
        else if (country.includes('china')) distance = 8500;
        else if (country.includes('japan')) distance = 9800;
        else if (country.includes('usa') || country.includes('united states')) distance = 10000;
        else if (country.includes('canada')) distance = 9200;
        else distance = 3000; // Default international
    }
    
    // Calculate estimated duration (average 50 km/h for freight)
    const durationHours = Math.ceil(distance / 50);
    
    // Return Google Maps API format response
    return {
        origin_addresses: ["Muğla, Turkey"],
        destination_addresses: [destination],
        rows: [{
            elements: [{
                distance: {
                    text: `${distance.toLocaleString()} km`,
                    value: distance * 1000 // Google returns meters
                },
                duration: {
                    text: `${durationHours} hours`,
                    value: durationHours * 3600 // Google returns seconds
                },
                status: "OK"
            }]
        }],
        status: "OK"
    };
}

/**
 * Calculate distance from Muğla to destination
 * Uses Google Maps API simulation
 * @param {string} destination - City, Country format
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(destination) {
    // Simulate Google Maps API call
    const apiResponse = simulateGoogleMapsAPI(destination);
    
    if (apiResponse.status === "OK" && apiResponse.rows[0].elements[0].status === "OK") {
        // Extract distance from API response (convert meters to km)
        return apiResponse.rows[0].elements[0].distance.value / 1000;
    }
    
    // Fallback for API errors
    console.log(`Google Maps API simulation failed for ${destination}, using default`);
    return 3000; // Default international distance
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
    simulateGoogleMapsAPI, // Export for testing/debugging
    getAllDestinations: () => Object.keys(distances).sort()
};

