const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db.json');

// In-memory data object
let db = null;

/**
 * Load database from JSON file into memory
 */
function loadDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        db = JSON.parse(data);
        console.log('✅ Database loaded into memory from db.json');
        return db;
    } catch (error) {
        console.error('Error loading database:', error.message);
        throw error;
    }
}

/**
 * Save in-memory data to JSON file (synchronous)
 */
function saveDatabase() {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log('💾 Database saved to db.json');
    } catch (error) {
        console.error('Error saving database:', error.message);
        throw error;
    }
}

/**
 * Get the in-memory database
 */
function getDatabase() {
    if (!db) {
        loadDatabase();
    }
    return db;
}

/**
 * Get next ID for a collection
 */
function getNextId(collection) {
    const items = db[collection];
    if (!items || items.length === 0) return 1;
    
    const maxId = Math.max(...items.map(item => {
        const id = typeof item.id === 'string' ? parseInt(item.id.replace(/[^\d]/g, '')) : item.id;
        return isNaN(id) ? 0 : id;
    }));
    
    return maxId + 1;
}

/**
 * Find one item in collection
 */
function findOne(collection, predicate) {
    const items = db[collection];
    if (!items) return null;
    return items.find(predicate);
}

/**
 * Find all items in collection (with optional filter)
 */
function findAll(collection, predicate = null) {
    const items = db[collection];
    if (!items) return [];
    if (predicate) return items.filter(predicate);
    return items;
}

/**
 * Insert item into collection
 */
function insert(collection, item) {
    if (!db[collection]) {
        db[collection] = [];
    }
    
    // Auto-assign ID if not present
    if (!item.id) {
        item.id = getNextId(collection);
    }
    
    db[collection].push(item);
    saveDatabase();
    return item;
}

/**
 * Update item in collection
 */
function update(collection, predicate, updates) {
    const items = db[collection];
    if (!items) return null;
    
    const index = items.findIndex(predicate);
    if (index === -1) return null;
    
    db[collection][index] = { ...db[collection][index], ...updates };
    saveDatabase();
    return db[collection][index];
}

/**
 * Update multiple items
 */
function updateMany(collection, predicate, updates) {
    const items = db[collection];
    if (!items) return 0;
    
    let count = 0;
    db[collection] = items.map(item => {
        if (predicate(item)) {
            count++;
            return { ...item, ...updates };
        }
        return item;
    });
    
    if (count > 0) {
        saveDatabase();
    }
    return count;
}

/**
 * Delete item from collection
 */
function deleteOne(collection, predicate) {
    const items = db[collection];
    if (!items) return false;
    
    const index = items.findIndex(predicate);
    if (index === -1) return false;
    
    db[collection].splice(index, 1);
    saveDatabase();
    return true;
}

/**
 * Get or update financials (special case - single object)
 */
function getFinancials() {
    return db.financials || {
        total_revenue: 0,
        total_expenses: 0,
        net_income: 0,
        tax: 0,
        profit_after_tax: 0,
        updated_at: new Date().toISOString()
    };
}

function updateFinancials(updates) {
    db.financials = { ...db.financials, ...updates, updated_at: new Date().toISOString() };
    saveDatabase();
    return db.financials;
}

module.exports = {
    loadDatabase,
    saveDatabase,
    getDatabase,
    getNextId,
    findOne,
    findAll,
    insert,
    update,
    updateMany,
    deleteOne,
    getFinancials,
    updateFinancials
};

