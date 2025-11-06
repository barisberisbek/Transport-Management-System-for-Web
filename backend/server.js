require('dotenv').config();
const app = require('./src/app');
const { loadDatabase } = require('./src/config/dataStore');

const PORT = process.env.PORT || 5000;

// Load database into memory on startup
console.log('📂 Loading database from db.json...');
loadDatabase();

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚢 Transport & Management System API (JSON Store)');
    console.log('📍 CENG 3507 Midterm Project');
    console.log('='.repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/`);
    console.log(`Data Store: db.json`);
    console.log('='.repeat(50));
});

