const bcrypt = require('bcryptjs');
const { findOne, insert } = require('../config/dataStore');
const { generateToken } = require('../middleware/auth');

/**
 * Register new user (Customer)
 */
async function register(req, res) {
    try {
        const { username, email, password, role = 'Customer' } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        // Check if user exists
        const existingUser = findOne('users', u => u.username === username || u.email === email);
        
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Insert user
        const user = insert('users', {
            username,
            email,
            password_hash,
            role,
            created_at: new Date().toISOString()
        });
        
        // Generate token
        const token = generateToken(user);
        
        // Remove password from response
        const { password_hash: _, ...userWithoutPassword } = user;
        
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

/**
 * Login user
 */
async function login(req, res) {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Find user
        const user = findOne('users', u => u.username === username || u.email === username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Remove password from response
        const { password_hash: _, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

/**
 * Get current user info
 */
async function getCurrentUser(req, res) {
    try {
        const user = findOne('users', u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { password_hash: _, ...userWithoutPassword } = user;
        
        res.json({ user: userWithoutPassword });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
}

module.exports = {
    register,
    login,
    getCurrentUser
};

