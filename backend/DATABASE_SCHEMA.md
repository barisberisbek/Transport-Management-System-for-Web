# Database Schema Documentation

## Transport & Management System Database Design

This document outlines the database schema for the Global Freight Transport & Management System. While the current implementation uses JSON file storage (`db.json`), this schema can be easily migrated to SQL (PostgreSQL) or NoSQL (MongoDB) databases.

---

## 📊 Schema Overview

### SQL Implementation (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments Table
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Fresh', 'Frozen', 'Organic')),
    weight DECIMAL(10,2) NOT NULL,
    container_type VARCHAR(20) NOT NULL CHECK (container_type IN ('Small', 'Medium', 'Large')),
    container_id INTEGER REFERENCES containers(id),
    destination VARCHAR(200) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    estimated_delivery_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Containers Table  
CREATE TABLE containers (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Small', 'Medium', 'Large')),
    capacity DECIMAL(10,2) NOT NULL,
    current_load DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fleet Table
CREATE TABLE fleet (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Ship', 'Truck')),
    capacity DECIMAL(12,2) NOT NULL,
    fuel_cost_per_km DECIMAL(8,2) NOT NULL,
    crew_cost DECIMAL(10,2) NOT NULL,
    maintenance DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Available',
    total_distance_traveled DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) UNIQUE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    min_stock DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'kg',
    last_restocked TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Records Table
CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_expenses DECIMAL(15,2) DEFAULT 0,
    fleet_expenses DECIMAL(15,2) DEFAULT 0,
    other_expenses DECIMAL(15,2) DEFAULT 0,
    net_income DECIMAL(15,2) DEFAULT 0,
    tax_rate DECIMAL(4,2) DEFAULT 20.00,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    profit_after_tax DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_shipments_customer ON shipments(customer_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_container ON shipments(container_id);
CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_fleet_status ON fleet(status);
```

---

## 🗄️ NoSQL Implementation (MongoDB)

### Collections Structure

#### users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password_hash: String,
  role: String (enum: ["Admin", "Customer"]),
  created_at: Date,
  updated_at: Date
}
```

#### shipments
```javascript
{
  _id: ObjectId,
  customer_id: ObjectId (ref: users),
  product_name: String,
  category: String (enum: ["Fresh", "Frozen", "Organic"]),
  weight: Number,
  container_type: String (enum: ["Small", "Medium", "Large"]),
  container_id: ObjectId (ref: containers),
  destination: String,
  distance: Number,
  price: Number,
  status: String (default: "Pending"),
  estimated_delivery_days: Number,
  created_at: Date,
  delivered_at: Date
}
```

#### containers
```javascript
{
  _id: ObjectId,
  type: String (enum: ["Small", "Medium", "Large"]),
  capacity: Number,
  current_load: Number (default: 0),
  status: String (default: "Available"),
  shipments: [ObjectId] (refs: shipments),
  created_at: Date,
  updated_at: Date
}
```

#### fleet
```javascript
{
  _id: String,
  name: String,
  type: String (enum: ["Ship", "Truck"]),
  capacity: Number,
  fuel_cost_per_km: Number,
  crew_cost: Number,
  maintenance: Number,
  status: String (default: "Available"),
  total_distance_traveled: Number (default: 0),
  trips: [{
    date: Date,
    distance: Number,
    expense: Number
  }],
  created_at: Date
}
```

#### inventory
```javascript
{
  _id: ObjectId,
  category: String (unique),
  quantity: Number,
  min_stock: Number,
  unit: String (default: "kg"),
  history: [{
    date: Date,
    type: String (enum: ["deduction", "restock"]),
    amount: Number,
    reason: String
  }],
  last_restocked: Date,
  updated_at: Date
}
```

#### financials
```javascript
{
  _id: ObjectId,
  period_start: Date,
  period_end: Date,
  total_revenue: Number,
  total_expenses: Number,
  fleet_expenses: Number,
  other_expenses: Number,
  net_income: Number,
  tax_rate: Number (default: 20),
  tax_amount: Number,
  profit_after_tax: Number,
  transactions: [{
    date: Date,
    type: String,
    amount: Number,
    description: String
  }],
  created_at: Date
}
```

---

## 📋 Current JSON Implementation

### db.json Structure
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@transport.com",
      "password_hash": "$2a$10$...",
      "role": "Admin"
    }
  ],
  "shipments": [
    {
      "id": 1,
      "customer_id": 2,
      "product_name": "Fresh Blueberries",
      "category": "Fresh",
      "weight": 500,
      "container_type": "Small",
      "container_id": null,
      "destination": "Berlin, Germany",
      "distance": 3000,
      "price": 15000,
      "status": "Pending",
      "estimated_delivery_days": 6,
      "created_at": "2024-11-06T10:00:00Z"
    }
  ],
  "containers": [
    {
      "id": 1,
      "type": "Small",
      "capacity": 2000,
      "current_load": 0,
      "status": "Available",
      "shipments": []
    }
  ],
  "fleet": [
    {
      "id": "S001",
      "name": "BlueSea",
      "type": "Ship",
      "capacity": 100000,
      "fuel_cost_per_km": 40,
      "crew_cost": 20000,
      "maintenance": 10000,
      "status": "Available"
    }
  ],
  "inventory": [
    {
      "id": 1,
      "category": "Fresh",
      "quantity": 4500,
      "min_stock": 2000,
      "unit": "kg"
    }
  ],
  "financials": {
    "total_revenue": 0,
    "total_expenses": 0,
    "tax_rate": 20,
    "tax": 0,
    "profit_after_tax": 0
  }
}
```

---

## 🔄 Data Relationships

### Entity Relationships
1. **Users → Shipments**: One-to-Many (Customer can have multiple shipments)
2. **Containers → Shipments**: One-to-Many (Container can hold multiple shipments)
3. **Shipments → Inventory**: Many-to-One (Multiple shipments affect inventory)
4. **Fleet → Financials**: Many-to-One (Fleet expenses contribute to financials)

### Business Rules
1. **Container Assignment**: Only "Pending" shipments can be assigned to "Available" containers
2. **Status Transitions**: 
   - Shipments: Pending → Ready for Transport → In Transit → Delivered
   - Containers: Available → Ready for Transport → In Transit → Available
3. **Inventory Deduction**: Automatic when shipment is created
4. **Financial Calculation**: Tax is always 20% of Net Income

---

## 🚀 Migration Guide

### From JSON to PostgreSQL
```javascript
// Example migration script
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  
  // Migrate users
  for (const user of data.users) {
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [user.username, user.email, user.password_hash, user.role]
    );
  }
  
  // Continue for other tables...
}
```

### From JSON to MongoDB
```javascript
const fs = require('fs');
const { MongoClient } = require('mongodb');

async function migrate() {
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db('transport');
  
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  
  // Migrate collections
  await db.collection('users').insertMany(data.users);
  await db.collection('shipments').insertMany(data.shipments);
  // Continue for other collections...
}
```

---

## 📊 Sample Queries

### SQL Examples
```sql
-- Get Ali Yılmaz's shipment to Berlin
SELECT s.*, u.username 
FROM shipments s
JOIN users u ON s.customer_id = u.id
WHERE u.username = 'aliyilmaz' 
  AND s.destination = 'Berlin, Germany';

-- Calculate BlueSea trip expense
SELECT 
  name,
  (fuel_cost_per_km * 3000) + crew_cost + maintenance AS trip_expense
FROM fleet
WHERE name = 'BlueSea';

-- Get containers ready for transport
SELECT * FROM containers 
WHERE status = 'Ready for Transport';
```

### MongoDB Examples
```javascript
// Get Ali's shipment
db.shipments.aggregate([
  { $match: { destination: "Berlin, Germany" }},
  { $lookup: {
    from: "users",
    localField: "customer_id",
    foreignField: "_id",
    as: "customer"
  }}
]);

// Calculate fleet expense
db.fleet.findOne(
  { name: "BlueSea" },
  { projection: {
    trip_expense: {
      $add: [
        { $multiply: ["$fuel_cost_per_km", 3000] },
        "$crew_cost",
        "$maintenance"
      ]
    }
  }}
);
```

---

## 🔐 Security Considerations

1. **Password Storage**: Use bcrypt with salt rounds >= 10
2. **SQL Injection**: Use parameterized queries
3. **MongoDB Injection**: Validate and sanitize inputs
4. **Access Control**: Implement role-based permissions
5. **Data Validation**: Enforce constraints at database level

---

## 📈 Performance Optimization

1. **Indexes**: Create on frequently queried fields
2. **Pagination**: Implement for large result sets
3. **Caching**: Consider Redis for frequently accessed data
4. **Connection Pooling**: Use for database connections
5. **Query Optimization**: Analyze and optimize slow queries

---

*Last Updated: November 2024*
*Version: 1.0*
