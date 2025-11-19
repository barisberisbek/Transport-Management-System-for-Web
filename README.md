# 🚢 Transport & Management System

**CENG 3507: Web Development and Programming - Midterm Project**  
Muğla Sıtkı Koçman Üniversitesi | Prof. Dr. Bekir Taner Dinçer

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Use Case Validation](#-use-case-validation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

A full-stack web application for managing global freight transportation operations from Muğla, Turkey. The system handles shipment creation with automatic price calculation, container optimization using bin-packing algorithms, fleet management, financial tracking, inventory control, and comprehensive reporting.

**Data Storage**: Uses a **JSON file (`db.json`)** as the persistent data store - simple, transparent, and perfect for this academic project. Full SQL/NoSQL schema documentation available in `backend/DATABASE_SCHEMA.md` for production migration.

### Key Highlights

- ✅ RESTful API with JWT authentication
- ✅ JSON file-based data persistence (with SQL/NoSQL migration path)
- ✅ Container optimization (First-Fit Decreasing algorithm - Bin Packing)
- ✅ Google Maps API simulation for distance calculation
- ✅ Real-time price calculation based on distance
- ✅ Fleet expense management (3 ships + 4 trucks)
- ✅ Financial tracking with exactly 20% tax calculation
- ✅ Inventory management with low-stock alerts
- ✅ Container status: "Ready for Transport" when optimized
- ✅ Responsive React frontend with modern UI

---

## 🎨 Features

### Customer Portal

- **Home Page**: Company overview and services
- **Create Shipment**: Product entry with automatic price calculation
  - Distance calculation from Muğla to worldwide destinations
  - Formula: `Total Price = Distance × Rate per km (₺5/₺8/₺12 based on container size)`
- **Track Shipment**: Real-time tracking by order ID (public access)
- **Dashboard**: View all personal shipments with status

### Admin Dashboard (6 Modules)

1. **📦 Shipments**: Manage all shipments, update statuses
2. **🚚 Container Optimization**: Bin-packing algorithm implementation
3. **🚢 Fleet Management**: Manage vehicles with expense calculator
4. **💰 Financials**: Revenue, expenses, tax (20%), profit tracking
5. **🫐 Inventory**: Blueberry stock with automated alerts
6. **📈 Reports**: Comprehensive business analytics

---

## 🛠️ Technology Stack

### Backend
- **Node.js + Express.js**: RESTful API server
- **JSON File Storage**: Persistent data in `db.json` (Database schemas for PostgreSQL/MongoDB included)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin support
- **Google Maps API Simulation**: Distance calculation without API key requirement

### Frontend
- **React 18**: Modern UI library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **Modern CSS3**: Flexbox, Grid, Custom Properties

### Data Architecture
- **Pre-populated `db.json`**: Contains all initial data
- **Read on startup**: Loads entire database into memory
- **Write on change**: Synchronously saves after every modification
- **Human-readable**: Easy to inspect and debug

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation (3 Steps)

**1. Backend Setup**

```bash
cd backend
npm install

# Start backend (automatically loads db.json)
npm run dev
```

Backend runs on http://localhost:5000

**2. Frontend Setup**

```bash
cd frontend
npm install

# Start frontend
npm start
```

Frontend runs on http://localhost:3000

**3. Login**

- **Admin**: username `admin`, password `admin123`
- **Or** register a new customer account

### That's It! 🎉

The `db.json` file is already pre-populated with:
- Admin user account
- 7 containers (2 Small, 2 Medium, 3 Large)
- 7 fleet vehicles (3 ships + 4 trucks)
- 3 inventory categories (Fresh, Frozen, Organic)

---

## 📖 Detailed Setup

### Step 1: Backend Configuration

#### Install Dependencies

```bash
cd backend
npm install
```

**Packages installed**: 
- express (Web framework)
- cors (Cross-origin requests)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (Environment variables)
- body-parser (Request parsing)
- nodemon (Development tool)

#### Environment File (Optional)

Create `backend/.env` for custom configuration:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production_2024
NODE_ENV=development
```

**Note**: Default values work fine if you skip this step.

#### Start Backend

```bash
npm run dev
```

**Expected output**:
```
📂 Loading database from db.json...
✅ Database loaded into memory from db.json
==================================================
🚢 Transport & Management System API (JSON Store)
📍 CENG 3507 Midterm Project
==================================================
Server running on port 5000
Data Store: db.json
==================================================
```

**Keep this terminal open!**

### Step 2: Frontend Configuration

Open a **new terminal**:

```bash
cd frontend
npm install
```

**Packages installed**: react, react-dom, react-router-dom, axios, react-scripts

**Optional**: Create `frontend/.env` to customize API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

Browser opens automatically at http://localhost:3000

### Verification

- ✅ Backend: http://localhost:5000 shows API info
- ✅ Frontend: http://localhost:3000 shows home page
- ✅ Login works with admin/admin123
- ✅ Can register new customer
- ✅ Can create shipment with price calculation

### Data Persistence

**View your data**: Open `backend/db.json` in any text editor to see all data in real-time!

Every operation (create shipment, optimize containers, restock inventory, etc.) **automatically saves to `db.json`**.

---

## 🎮 Usage Guide

### Test the Complete Use Case Scenario

**"Shipping 500kg Blueberries from Muğla to Berlin"** - Ali Yılmaz

#### Step 1: Customer Creates Shipment ✅

1. Register/Login as customer
2. Navigate to "Create Shipment"
3. Enter:
   - **Product**: Fresh Blueberries
   - **Category**: Fresh
   - **Weight**: 500 kg
   - **Container Type**: Small
   - **Destination**: Berlin, Germany
4. Click "Calculate Price & Create Shipment"

**Result**:
- ✅ Distance: 3,000 km (Muğla → Berlin)
- ✅ Price: **₺15,000** (3,000 km × ₺5/km)
- ✅ Shipment saved to `db.json`
- ✅ Inventory auto-updated (-500 kg from Fresh)

**Verify**: Open `backend/db.json` → see your shipment in the `"shipments"` array!

#### Step 2: Admin Optimizes Containers ✅

1. Login as admin (admin/admin123)
2. Go to Admin Dashboard → Container Optimization
3. Click "Run Optimization Algorithm"

**Result**: 
- Shipments packed using First-Fit Decreasing algorithm
- Container assignments saved to `db.json`

#### Step 3: Fleet Management ✅

1. Admin Dashboard → Fleet Management
2. Trip Expense Calculator:
   - **Vehicle**: BlueSea
   - **Distance**: 3000 km
   - Click Calculate

**Result**: **₺150,000** = (₺40 × 3,000) + ₺20,000 + ₺10,000 ✅

**Formula breakdown displayed**: Shows complete calculation

#### Step 4: Financial Summary ✅

1. Admin Dashboard → Financials
2. View calculations:
   - Total Revenue from all shipments
   - Total Expenses from fleet operations
   - **Tax**: Exactly 20% of Net Income
   - Profit After Tax

**All values saved in `db.json`** under `"financials"` object

#### Step 5: Track Shipment ✅

1. Go to "Track Shipment" (in navbar)
2. Enter Order ID (e.g., 1)
3. View complete tracking information with status timeline

**Public access** - no login required!

#### Step 6: Inventory Monitoring ✅

1. Admin Dashboard → Inventory
2. View stock levels for all categories
3. See alerts: "⚠️ Frozen blueberries stock running low — please restock."

**Inventory updates saved immediately to `db.json`**

---

## 🔌 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login and get JWT token | No |
| `/api/auth/me` | GET | Get current user info | Yes |

**Request Example** (Register):
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Shipments

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/shipments/create` | POST | Create new shipment | Customer |
| `/api/shipments/track/:id` | GET | Track shipment (public) | No |
| `/api/shipments/my-shipments` | GET | Get customer's shipments | Customer |
| `/api/shipments/all` | GET | Get all shipments | Admin |
| `/api/shipments/:id/status` | PATCH | Update shipment status | Admin |

**Request Example** (Create Shipment):
```json
{
  "product_name": "Fresh Blueberries",
  "category": "Fresh",
  "weight": 500,
  "container_type": "Small",
  "destination": "Berlin, Germany"
}
```

**Response Example**:
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "id": 1,
    "price": 15000,
    "distance": 3000,
    "estimated_delivery_days": 6
  }
}
```

### Admin - Containers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/containers` | GET | List all containers |
| `/api/admin/containers/optimize` | POST | Run optimization algorithm |
| `/api/admin/containers/:id` | GET | Get container details |

### Admin - Fleet

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/fleet` | GET | List all vehicles (ships + trucks) |
| `/api/admin/fleet/calculate-expense` | POST | Calculate trip expense |
| `/api/admin/fleet/:id/status` | PATCH | Update vehicle status |

**Request Example** (Calculate Expense):
```json
{
  "vehicleId": "S001",
  "distance": 3000
}
```

### Admin - Inventory

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/inventory` | GET | Get inventory with low-stock alerts |
| `/api/admin/inventory/:category/restock` | POST | Restock specific category |

**Request Example** (Restock):
```json
{
  "quantity": 1000
}
```

### Admin - Financials

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/financial/summary` | GET | Get financial summary with tax |
| `/api/admin/financial/recalculate` | POST | Recalculate from all shipments |

### Admin - Reports

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/reports/generate` | GET | Generate comprehensive report |
| `/api/admin/reports/dashboard-stats` | GET | Get dashboard statistics |

---

## 📁 Project Structure

```
WebMidtermProject/
├── backend/
│   ├── db.json                     # 📂 JSON data store (persistent)
│   ├── DATABASE_SCHEMA.md          # 📋 SQL/NoSQL schema documentation
│   ├── generate-hash.js            # Password hash generator utility
│   ├── server.js                   # Server entry point
│   ├── package.json
│   └── src/
│       ├── app.js                  # Express app configuration
│       ├── config/
│       │   └── dataStore.js        # JSON read/write operations
│       ├── middleware/
│       │   └── auth.js             # JWT authentication middleware
│       ├── utils/
│       │   ├── distanceCalculator.js    # Distance calculations
│       │   ├── priceCalculator.js       # Price formula
│       │   ├── containerOptimizer.js    # Bin-packing algorithm
│       │   ├── fleetCalculator.js       # Fleet expense formula
│       │   └── financialCalculator.js   # Tax & profit calculations
│       ├── controllers/            # Business logic
│       │   ├── authController.js
│       │   ├── shipmentController.js
│       │   ├── containerController.js
│       │   ├── fleetController.js
│       │   ├── inventoryController.js
│       │   ├── financialController.js
│       │   └── reportController.js
│       └── routes/                 # API endpoint definitions
│           ├── authRoutes.js
│           ├── shipmentRoutes.js
│           ├── containerRoutes.js
│           ├── fleetRoutes.js
│           ├── inventoryRoutes.js
│           ├── financialRoutes.js
│           └── reportRoutes.js
│
├── frontend/
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── src/
│   │   ├── index.js                # React entry point
│   │   ├── App.js                  # Main app component with routing
│   │   ├── components/
│   │   │   ├── Navbar.js           # Navigation bar component
│   │   │   └── Footer.js           # Footer component
│   │   ├── pages/
│   │   │   ├── HomePage.js         # Landing page
│   │   │   ├── LoginPage.js        # Login form
│   │   │   ├── RegisterPage.js     # Registration form
│   │   │   ├── CustomerDashboard.js # Customer portal
│   │   │   ├── CreateShipment.js   # Shipment creation form
│   │   │   ├── TrackShipment.js    # Public tracking page
│   │   │   └── AdminDashboard.js   # Admin dashboard (6 tabs)
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   └── styles/
│   │       ├── index.css           # Global styles
│   │       └── App.css             # Component styles
│   └── package.json
│
├── README.md                       # This file
└── WebProjectDocumantation.txt     # Original project requirements
```

---

## ✅ Use Case Validation

### Complete Workflow: Ali Yılmaz Scenario

This implementation perfectly executes the **"Shipping Blueberries from Muğla to Berlin"** use case.

#### 1. Price Calculation Formula ✅

**Formula**: `Total Price = Distance × Rate per km`

**Container Rates**:
- Small: ₺5/km (2,000 kg capacity)
- Medium: ₺8/km (5,000 kg capacity)
- Large: ₺12/km (10,000 kg capacity)

**Example Calculation**:
```
Product: 500kg Fresh Blueberries
Destination: Berlin, Germany
Distance: 3,000 km
Container: Small (₺5/km)

Price = 3,000 km × ₺5/km = ₺15,000 ✅
```

**Implementation**: `backend/src/utils/priceCalculator.js`

```javascript
function calculatePrice(distance, containerType) {
    const rates = {
        'Small': 5,
        'Medium': 8,
        'Large': 12
    };
    return distance * rates[containerType];
}
```

#### 2. Distance Calculation ✅

**Simulated realistic distances** from Muğla, Turkey:

| Destination | Distance |
|------------|----------|
| Berlin, Germany | 3,000 km |
| Paris, France | 3,200 km |
| London, UK | 3,400 km |
| Madrid, Spain | 3,500 km |
| Rome, Italy | 2,800 km |
| Amsterdam, Netherlands | 3,100 km |
| Vienna, Austria | 2,600 km |

**Implementation**: `backend/src/utils/distanceCalculator.js`

#### 3. Container Optimization Algorithm ✅

**Algorithm**: First-Fit Decreasing (Bin Packing) - Exactly as specified in requirements

**Steps**:
1. Sort all pending shipments by weight (largest first) - FFD algorithm
2. For each shipment:
   - Find the first container with enough remaining capacity
   - Assign shipment to that container
   - Update container's remaining capacity
3. Mark containers with shipments as "Ready for Transport"

**Example**:
```
Shipments: 2,000kg, 500kg, 200kg
Large container capacity: 10,000kg

After packing:
- Total used: 2,700kg
- Remaining: 7,300kg
- Status: Ready ✅
```

**Implementation**: `backend/src/utils/containerOptimizer.js`

```javascript
function optimizeContainers(shipments, containers) {
    // Sort shipments by weight (descending)
    const sorted = shipments
        .filter(s => s.status === 'Pending')
        .sort((a, b) => b.weight - a.weight);
    
    // First-Fit Decreasing
    for (const shipment of sorted) {
        for (const container of containers) {
            if (shipment.weight <= container.remainingCapacity) {
                container.shipments.push(shipment);
                container.remainingCapacity -= shipment.weight;
                break;
            }
        }
    }
}
```

#### 4. Fleet Expense Calculation ✅

**Formula**: `Trip Expense = (Fuel Cost/km × Distance) + Crew/Driver Cost + Maintenance`

**BlueSea Ship Specifications**:
- Capacity: 100,000 kg
- Fuel Cost: ₺40/km
- Crew Cost: ₺20,000
- Maintenance: ₺10,000

**Calculation for 3,000 km trip**:
```
Fuel:        ₺40/km × 3,000 km = ₺120,000
Crew:        ₺20,000
Maintenance: ₺10,000
─────────────────────────────────────
Total:       ₺150,000 ✅
```

**Implementation**: `backend/src/utils/fleetCalculator.js`

```javascript
function calculateTripExpense(vehicle, distance) {
    const fuelExpense = vehicle.fuel_cost_per_km * distance;
    const crewExpense = vehicle.crew_cost;
    const maintenanceExpense = vehicle.maintenance;
    const total = fuelExpense + crewExpense + maintenanceExpense;
    
    return {
        totalExpense: total,
        breakdown: {
            fuel: fuelExpense,
            crew: crewExpense,
            maintenance: maintenanceExpense
        }
    };
}
```

#### 5. Financial Calculations ✅

**Formulas**:
```
Net Income = Total Revenue - Total Expenses
Tax = 20% × Net Income (exactly 20%)
Profit After Tax = Net Income - Tax
```

**Example**:
```
Total Revenue:     ₺1,200,000
Total Expenses:    ₺333,300
Net Income:        ₺866,700
Tax (20%):         ₺173,340
Profit After Tax:  ₺693,360 ✅
```

**Implementation**: `backend/src/utils/financialCalculator.js`

```javascript
const TAX_RATE = 0.20; // Exactly 20%

function calculateFinancials(revenue, expenses) {
    const netIncome = revenue - expenses;
    const tax = netIncome > 0 ? netIncome * TAX_RATE : 0;
    const profitAfterTax = netIncome - tax;
    
    return {
        totalRevenue: revenue,
        totalExpenses: expenses,
        netIncome,
        tax,
        taxRate: '20%',
        profitAfterTax
    };
}
```

#### 6. Inventory Management ✅

**Initial Stock** (in `db.json`):

| Category | Quantity | Min Stock | Status |
|----------|----------|-----------|--------|
| Fresh    | 4,500 kg | 2,000 kg  | ✅ OK  |
| Frozen   | 1,200 kg | 1,000 kg  | ⚠️ Low |
| Organic  | 8,000 kg | 2,500 kg  | ✅ OK  |

**After Ali's 500kg Fresh Blueberries Shipment**:

| Category | Quantity | Min Stock | Status |
|----------|----------|-----------|--------|
| Fresh    | 4,000 kg | 2,000 kg  | ✅ OK  |
| Frozen   | 1,200 kg | 1,000 kg  | ⚠️ Low |
| Organic  | 8,000 kg | 2,500 kg  | ✅ OK  |

**Alert System**:
- Triggers when: `quantity < min_stock`
- Alert message: "⚠️ [Category] blueberries stock running low — please restock."
- Automatically deducts inventory on shipment creation
- Updates saved immediately to `db.json`

**Implementation**: `backend/src/controllers/inventoryController.js`

---

## 🧮 Core Algorithms & Formulas Summary

### 1. Distance Calculation
```javascript
// Realistic simulated distances from Muğla
const destinations = {
    'Berlin, Germany': 3000,
    'Paris, France': 3200,
    'London, UK': 3400,
    // ... 30+ destinations
};
```

### 2. Price Calculation
```javascript
price = distance × ratePerKm
// Small: ₺5/km, Medium: ₺8/km, Large: ₺12/km
```

### 3. Container Optimization
```javascript
// First-Fit Decreasing Algorithm
1. Sort shipments by weight (largest → smallest)
2. For each shipment, assign to first container with space
3. Mark containers as "Ready"
```

### 4. Fleet Expense
```javascript
expense = (fuelCost × distance) + crewCost + maintenance
```

### 5. Financial Calculations
```javascript
tax = netIncome × 0.20  // Exactly 20%
profit = netIncome - tax
```

### 6. Inventory Alerts
```javascript
if (quantity < minStock) {
    showAlert("Stock running low");
}
```

---

## 🎨 Frontend Implementation

### HTML5 - Semantic Structure ✅

- `<nav>` - Navigation bar with links
- `<main>` - Main content container
- `<section>` - Content sections
- `<article>` - Independent content blocks
- `<footer>` - Footer information
- `<form>` - Forms with proper labels
- Proper heading hierarchy (h1 → h6)
- ARIA labels for accessibility

### CSS3 - Modern Styling ✅

- **Custom Properties**: CSS variables for consistent theming
- **Flexbox**: Navigation, card layouts, form alignment
- **Grid**: Dashboard statistics, admin tabs
- **Responsive Design**: Media queries for mobile/tablet
- **Animations**: Smooth transitions, loading spinners
- **Typography**: Clear hierarchy with proper font sizing
- **Color System**: Professional blue/white palette
- **Box Model**: Proper spacing with padding/margin

### JavaScript (React) - Interactive Features ✅

- **Client-side Validation**: Form validation before API calls
- **State Management**: useState, useEffect hooks
- **Event Handling**: Click, submit, change events
- **Async Operations**: API calls with axios
- **Error Handling**: Try-catch blocks with user feedback
- **Dynamic Content**: Real-time UI updates
- **Navigation**: React Router for SPA routing
- **Token Management**: JWT storage in localStorage

### Usability & Accessibility ✅

- **Keyboard Navigation**: Tab order, Enter key support
- **Focus Management**: Visible focus states
- **ARIA Labels**: Screen reader support
- **Error Messages**: Clear, actionable feedback
- **Loading States**: Visual indicators during API calls
- **Responsive**: Mobile-friendly design
- **Color Contrast**: WCAG compliant colors
- **Intuitive UI**: Clear labels and instructions

---

## 🚨 Troubleshooting

### Port 5000 Already in Use

**Windows (PowerShell)**:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Mac/Linux**:
```bash
lsof -ti:5000 | xargs kill -9
```

**Or change port** in `backend/.env`:
```env
PORT=5001
```

Don't forget to update frontend API URL if you change the port.

### Module Not Found Errors

```bash
# In the folder with error (backend or frontend)
rm -rf node_modules package-lock.json
npm install
```

### Data Reset / Corrupted db.json

If your `db.json` gets corrupted or you want to start fresh:

1. **Backup current data** (if needed):
   ```bash
   cp backend/db.json backend/db.json.backup
   ```

2. **Restore to initial state**: Delete and recreate with initial data structure

3. **Or manually edit**: Open `backend/db.json` in text editor and fix issues

### CORS Errors

**Symptoms**: Frontend can't connect to backend, console shows CORS errors

**Solutions**:
1. Ensure backend is running on port 5000
2. Check `frontend/src/services/api.js` has correct API URL
3. Restart backend first, then frontend
4. Clear browser cache

### Frontend Blank Page

1. Open browser DevTools (F12) → Console tab
2. Look for error messages
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Check if backend is running
   - Try incognito/private window
   - Restart frontend: Ctrl+C then `npm start`

### Login Doesn't Work

**Check**:
1. Backend is running (see terminal output)
2. `backend/db.json` exists and has admin user
3. Credentials: username `admin`, password `admin123`
4. No JavaScript errors in console (F12)

**Solution**: Check backend terminal for error messages

### Cannot See New Data

**Issue**: Created shipment doesn't appear

**Solution**:
1. Check backend terminal for errors
2. Open `backend/db.json` - is the data there?
3. Refresh frontend page (F5)
4. Check browser console for API errors

### JSON Parse Error

**Issue**: Backend crashes with JSON parse error

**Solution**: Your `db.json` file is corrupted
1. Check for syntax errors in `backend/db.json`
2. Use online JSON validator: jsonlint.com
3. Fix missing commas, brackets, or quotes

---

## 📊 Database Structure (db.json)

The `db.json` file contains all application data:

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password_hash": "$2a$10$...",
      "role": "Admin",
      "email": "admin@transport.com"
    }
  ],
  "shipments": [
    {
      "id": 1,
      "customer_id": 2,
      "product_name": "Fresh Blueberries",
      "weight": 500,
      "container_type": "Small",
      "destination": "Berlin, Germany",
      "distance": 3000,
      "price": 15000,
      "status": "Pending"
    }
  ],
  "containers": [
    {
      "id": 1,
      "type": "Small",
      "capacity": 2000,
      "current_load": 0,
      "status": "Available"
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
      "maintenance": 10000
    }
  ],
  "inventory": [
    {
      "id": 1,
      "category": "Fresh",
      "quantity": 4500,
      "min_stock": 2000
    }
  ],
  "financials": {
    "total_revenue": 0,
    "total_expenses": 0,
    "tax": 0,
    "profit_after_tax": 0
  }
}
```

### Initial Data Included

**Users**: 1 admin (admin/admin123)

**Containers**: 7 total
- 2 × Small (2,000 kg)
- 2 × Medium (5,000 kg)
- 3 × Large (10,000 kg)

**Fleet**: 7 vehicles
- **Ships**: BlueSea, OceanStar, AegeanWind
- **Trucks**: RoadKing, FastMove, CargoPro, HeavyLoad

**Inventory**: 3 categories
- Fresh: 4,500 kg
- Frozen: 1,200 kg
- Organic: 8,000 kg

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access**: Admin vs Customer permissions
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in .env file
- **Input Validation**: Both client and server-side

---

## 🚀 Production Deployment Tips

Before deploying to production:

1. **Change JWT Secret**: Use a strong random key in `.env`
2. **Use Real Database**: Consider PostgreSQL or MongoDB for scale
3. **Enable HTTPS**: Secure connections
4. **Add Rate Limiting**: Prevent abuse
5. **Error Logging**: Implement proper logging (Winston)
6. **Build Frontend**: `npm run build` for optimized bundle
7. **Environment Variables**: Use production environment config

---

## 🎓 Course Requirements Met (CENG 3507)

### HTML for Design ✅
- ✅ Semantic HTML5 elements
- ✅ Proper document structure
- ✅ Forms with labels and validation
- ✅ Accessibility attributes

### CSS for Styling ✅
- ✅ Modern CSS3 features
- ✅ Responsive design with media queries
- ✅ Flexbox and Grid layouts
- ✅ Custom properties (variables)
- ✅ Professional color scheme

### JavaScript for Interaction ✅
- ✅ Client-side form validation
- ✅ Event handling
- ✅ DOM manipulation
- ✅ Asynchronous operations
- ✅ API integration

### Usability Principles ✅
- ✅ Intuitive navigation
- ✅ Clear visual feedback
- ✅ Error prevention and recovery
- ✅ Consistent design patterns

### Accessibility Standards ✅
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Semantic structure
- ✅ Color contrast compliance

---

## ✅ Prompt Compliance Check

This implementation fully complies with the project prompt requirements:

### Core Requirements Met:
1. **Pricing Formula** ✅: `Total Price = Distance × Rate per km` (Small: 5₺, Medium: 8₺, Large: 12₺)
2. **Container Optimization** ✅: First-Fit Decreasing (FFD) Bin Packing Algorithm implemented
3. **Fleet Management** ✅: All 7 vehicles (3 ships + 4 trucks) with exact specifications
4. **Financial Dashboard** ✅: Tax = exactly 20% of Net Income
5. **Inventory Management** ✅: Auto-deduction and low-stock alerts
6. **Google Maps API** ✅: Simulated with realistic distances (no API key required)
7. **Container Status** ✅: Changes to "Ready for Transport" when optimized

### Test Case Verification:
- **Customer**: Ali Yılmaz ✅
- **Order**: 500kg Fresh Blueberries to Berlin ✅
- **Distance**: 3,000 km ✅
- **Price**: 3,000 × 5₺ = 15,000₺ ✅
- **Fleet Expense (BlueSea)**: (40 × 3,000) + 20,000 + 10,000 = 150,000₺ ✅

### Implementation Choices:
- **JSON vs SQL/NoSQL**: JSON chosen for simplicity; full schema documentation provided for migration
- **Google Maps Simulation**: Pre-calculated distances for reliability and cost-saving
- **Container Status Naming**: "Ready for Transport" as per requirements

---

## 📝 Commands Reference

### Backend Commands

```bash
npm start          # Start server (production)
npm run dev        # Start with nodemon (development, auto-restart)
```

### Frontend Commands

```bash
npm start          # Start development server (port 3000)
npm run build      # Build optimized production bundle
npm test           # Run tests
```

### Daily Workflow

**Starting the application**:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm start
```

**Stopping the application**:
- Press `Ctrl+C` in each terminal

**Viewing data**:
- Open `backend/db.json` in any text editor

**Reset data**:
- Restore `backend/db.json` from backup or recreate manually

---

## 💡 JSON Data Store Advantages

### Why JSON File?

1. **✅ Simplicity**: No database setup required
2. **✅ Transparency**: Open `db.json` to see all data
3. **✅ Easy Debugging**: Human-readable format
4. **✅ Version Control**: Can track data changes in git
5. **✅ Perfect for Learning**: Understand data flow easily
6. **✅ Quick Reset**: Just restore the file
7. **✅ No External Dependencies**: No database server needed

### How It Works

```javascript
// Load on startup
loadDatabase() → Read db.json → Store in memory

// During operation
API call → Modify data in memory → saveDatabase() → Write to db.json

// Result
All changes persist to file immediately!
```

---

## 🏆 Project Status

### ✅ Complete and Fully Functional

- ✅ All requirements implemented
- ✅ All formulas match documentation exactly
- ✅ Use case scenario validated
- ✅ Professional quality code
- ✅ Comprehensive documentation
- ✅ JSON persistence working perfectly
- ✅ Ready for demonstration and submission

### Testing Checklist

- [x] Backend starts successfully
- [x] Frontend loads without errors
- [x] Can register new customer
- [x] Can login as admin
- [x] Can create shipment with correct price
- [x] Container optimization works
- [x] Fleet expense calculator accurate
- [x] Financial calculations show 20% tax
- [x] Inventory alerts display correctly
- [x] Reports generate successfully
- [x] Shipment tracking works (public)
- [x] Data persists in db.json after restart

---

## 📞 Support

For questions or issues:

1. Check the **Troubleshooting** section above
2. Review browser console (F12) for error messages
3. Check backend terminal for server errors
4. Verify both servers are running
5. Inspect `backend/db.json` for data integrity

---

## 📄 License

This project is created for educational purposes as part of CENG 3507 coursework at Muğla Sıtkı Koçman Üniversitesi.

---

## 🙏 Acknowledgments

- **Course**: CENG 3507: Web Development and Programming
- **Instructor**: Prof. Dr. Bekir Taner Dinçer
- **Institution**: Muğla Sıtkı Koçman Üniversitesi
- **Project Type**: Midterm Project

---

**Built with ❤️ for CENG 3507**

*Last updated: November 6, 2024*  
*Version: 2.0 (JSON Data Store)*
