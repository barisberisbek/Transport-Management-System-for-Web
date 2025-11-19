// Container Optimization Algorithm
// Implements: Bin Packing Algorithm (First-Fit Decreasing)
// Core Algorithm as specified in project requirements:
// 1. Sort all pending shipments by weight (Largest to Smallest)
// 2. Place shipment into the first container with enough remaining capacity
// 3. Mark container as "Ready for Transport" when full or optimized

const toNumber = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Optimize container packing using First-Fit Decreasing Algorithm
 * @param {Array} shipments - Array of shipment objects with weight
 * @param {Array} containers - Array of available containers
 * @returns {Object} - Optimization result with assignments
 */
function optimizeContainers(shipments, containers) {
    // Step 1: Sort shipments by weight (largest first) - First-Fit Decreasing
    const sortedShipments = [...shipments].sort(
        (a, b) => toNumber(b.weight) - toNumber(a.weight)
    );
    
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
    const containerUsage = availableContainers.map(c => {
        const capacity = toNumber(c.capacity);
        const currentLoad = toNumber(c.current_load);
        
        return {
            ...c,
            capacity,
            current_load: currentLoad,
            shipments: [],
            remainingCapacity: capacity - currentLoad
        };
    });
    
    // Step 3: Place each shipment into first container with enough space
    for (const shipment of pendingShipments) {
        const shipmentWeight = toNumber(shipment.weight);
        if (shipmentWeight <= 0) {
            continue;
        }
        
        let assigned = false;
        
        for (const container of containerUsage) {
            // Check if shipment fits in this container
            if (shipmentWeight <= container.remainingCapacity) {
                // Assign shipment to this container
                container.shipments.push({ ...shipment, weight: shipmentWeight });
                container.remainingCapacity = Number((container.remainingCapacity - shipmentWeight).toFixed(2));
                container.current_load = Number((container.current_load + shipmentWeight).toFixed(2));
                
                assignments.push({
                    shipmentId: shipment.id,
                    containerId: container.id,
                    containerType: container.type,
                    weight: shipmentWeight
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
    
    // Step 4: Mark containers as "Ready for Transport" if they have shipments
    const updatedContainers = containerUsage
        .filter(c => c.shipments.length > 0)
        .map(c => {
            const capacity = Math.max(toNumber(c.capacity), 0);
            const currentLoad = Math.min(toNumber(c.current_load), capacity);
            const remainingCapacity = Math.max(Number((capacity - currentLoad).toFixed(2)), 0);
            const utilization = capacity === 0 ? 0 : (currentLoad / capacity) * 100;
            
            return {
                id: c.id,
                type: c.type,
                capacity: capacity,
                current_load: currentLoad,
                remaining_capacity: remainingCapacity,
                shipment_count: c.shipments.length,
                utilization: utilization.toFixed(2) + '%',
                status: 'Ready for Transport'
            };
        });
    
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
        c.status === 'Ready for Transport' || c.status === 'In Transit' || c.status === 'Delivered'
    );
    
    if (inUseContainers.length === 0) return 0;
    
    const totalUtilization = inUseContainers.reduce((sum, c) => {
        const capacity = toNumber(c.capacity);
        if (capacity <= 0) return sum;
        const currentLoad = Math.min(toNumber(c.current_load), capacity);
        return sum + ((currentLoad / capacity) * 100);
    }, 0);
    
    return (totalUtilization / inUseContainers.length).toFixed(2);
}

module.exports = {
    optimizeContainers,
    calculateUtilization
};

