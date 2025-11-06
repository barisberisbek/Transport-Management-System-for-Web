const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production_2024';

/**
 * Middleware to verify JWT token
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        req.user = user;
        next();
    });
}

/**
 * Middleware to check if user is admin
 */
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

/**
 * Middleware to check if user is customer
 */
function requireCustomer(req, res, next) {
    if (!req.user || req.user.role !== 'Customer') {
        return res.status(403).json({ error: 'Customer access required' });
    }
    next();
}

/**
 * Generate JWT token
 */
function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            email: user.email,
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

module.exports = {
    authenticateToken,
    requireAdmin,
    requireCustomer,
    generateToken
};

