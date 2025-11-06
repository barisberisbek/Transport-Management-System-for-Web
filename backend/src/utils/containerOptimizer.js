// Container Optimization Algorithm
// Implements: Bin Packing Algorithm (First-Fit Decreasing)
// Exactly as per documentation

/**
 * Optimize container packing using First-Fit Decreasing Algorithm
 * @param {Array} shipments - Array of shipment objects with weight
 * @param {Array} containers - Array of available containers
 * @returns {Object} - Optimization result with assignments
 */
function optimizeContainers(shipments, containers) {
    // Step 1: Sort shipments by weight (largest first) - First-Fit Decreasing
    const sortedShipments = [...shipments].sort((a, b) => b.weight - a.weight);
    
    // Step 2: Filter only pending shipments and available containers
    const pendingShipments = sortedShipments.filter(s => s.status === 'Pending');
    const availableContainers = containers.filter(c => c.status === 'Available');
    
    if (pendingShipments.length === 0) {
        return {
            success: false,
            message: 'No pending shipments to optimize',
            assignments: []
        };
    }
    
    if (availableContainers.length === 0) {
        return {
            success: false,
            message: 'No available containers',
            assignments: []
        };
    }
    
    const assignments = [];
    const containerUsage = availableContainers.map(c => ({
        ...c,
        shipments: [],
        remainingCapacity: c.capacity - c.current_load
    }));
    
    // Step 3: Place each shipment into first container with enough space
    for (const shipment of pendingShipments) {
        let assigned = false;
        
        for (const container of containerUsage) {
            // Check if shipment fits in this container
            if (shipment.weight <= container.remainingCapacity) {
                // Assign shipment to this container
                container.shipments.push(shipment);
                container.remainingCapacity -= shipment.weight;
                container.current_load += shipment.weight;
                
                assignments.push({
                    shipmentId: shipment.id,
                    containerId: container.id,
                    containerType: container.type,
                    weight: shipment.weight
                });
                
                assigned = true;
                break; // Move to next shipment
            }
        }
        
        if (!assigned) {
            // Could not fit this shipment - need more containers
            console.log(`Warning: Shipment ${shipment.id} (${shipment.weight}kg) could not be assigned`);
        }
    }
    
    // Step 4: Mark containers as "Ready" if they have shipments
    const updatedContainers = containerUsage
        .filter(c => c.shipments.length > 0)
        .map(c => ({
            id: c.id,
            type: c.type,
            capacity: c.capacity,
            current_load: c.current_load,
            remaining_capacity: c.remainingCapacity,
            shipment_count: c.shipments.length,
            utilization: ((c.current_load / c.capacity) * 100).toFixed(2) + '%',
            status: 'Ready'
        }));
    
    return {
        success: true,
        message: `Optimized ${assignments.length} shipments into ${updatedContainers.length} containers`,
        assignments,
        containers: updatedContainers,
        totalShipmentsAssigned: assignments.length,
        containersUsed: updatedContainers.length
    };
}

/**
 * Calculate container utilization rate
 * @param {Array} containers 
 * @returns {number} - Average utilization percentage
 */
function calculateUtilization(containers) {
    const inUseContainers = containers.filter(c => 
        c.status === 'Ready' || c.status === 'In Transit' || c.status === 'Delivered'
    );
    
    if (inUseContainers.length === 0) return 0;
    
    const totalUtilization = inUseContainers.reduce((sum, c) => {
        return sum + (c.current_load / c.capacity * 100);
    }, 0);
    
    return (totalUtilization / inUseContainers.length).toFixed(2);
}

module.exports = {
    optimizeContainers,
    calculateUtilization
};

