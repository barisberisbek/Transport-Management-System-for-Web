// Fleet Expense Calculator
// Formula (exactly as per documentation):
// Trip Expense = (Fuel Cost/km × Distance) + Crew/Driver + Maintenance

/**
 * Calculate trip expense for a vehicle
 * @param {Object} vehicle - Fleet vehicle object
 * @param {number} distance - Distance in kilometers
 * @returns {Object} - Expense breakdown
 */
function calculateTripExpense(vehicle, distance) {
    // Exact formula from documentation
    const fuelExpense = vehicle.fuel_cost_per_km * distance;
    const crewExpense = vehicle.crew_cost;
    const maintenanceExpense = vehicle.maintenance;
    
    const totalExpense = fuelExpense + crewExpense + maintenanceExpense;
    
    return {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleType: vehicle.type,
        distance: distance,
        fuelExpense: fuelExpense,
        crewExpense: crewExpense,
        maintenanceExpense: maintenanceExpense,
        totalExpense: totalExpense,
        breakdown: `(₺${vehicle.fuel_cost_per_km} × ${distance} km) + ₺${crewExpense} + ₺${maintenanceExpense} = ₺${totalExpense}`
    };
}

/**
 * Select optimal vehicle for shipment based on weight and destination
 * @param {number} weight - Total weight in kg
 * @param {string} destinationCountry - Country name
 * @param {Array} fleet - Available fleet vehicles
 * @returns {Object} - Selected vehicle
 */
function selectVehicle(weight, destinationCountry, fleet) {
    const isInternational = !destinationCountry.toLowerCase().includes('turkey');
    
    if (isInternational) {
        // Select ship based on capacity and availability
        const ships = fleet.filter(v => 
            v.type === 'Ship' && 
            v.capacity >= weight && 
            v.status === 'Available'
        );
        
        if (ships.length === 0) {
            throw new Error('No available ships for international delivery');
        }
        
        // Select most cost-efficient ship
        return ships.sort((a, b) => a.total_expense - b.total_expense)[0];
    } else {
        // Select truck for domestic
        const trucks = fleet.filter(v => 
            v.type === 'Truck' && 
            v.capacity >= weight && 
            v.status === 'Available'
        );
        
        if (trucks.length === 0) {
            throw new Error('No available trucks for domestic delivery');
        }
        
        // Select most cost-efficient truck
        return trucks.sort((a, b) => a.total_expense - b.total_expense)[0];
    }
}

/**
 * Calculate total fleet expenses for all trips
 * @param {Array} trips - Array of trip objects with vehicle and distance
 * @returns {number} - Total expenses
 */
function calculateTotalFleetExpenses(trips) {
    return trips.reduce((total, trip) => {
        const expense = calculateTripExpense(trip.vehicle, trip.distance);
        return total + expense.totalExpense;
    }, 0);
}

module.exports = {
    calculateTripExpense,
    selectVehicle,
    calculateTotalFleetExpenses
};

