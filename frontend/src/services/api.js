import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me')
};

// Shipment API
export const shipmentAPI = {
    create: (data) => api.post('/shipments/create', data),
    track: (id) => api.get(`/shipments/track/${id}`),
    getMyShipments: () => api.get('/shipments/my-shipments'),
    getAll: (status) => api.get('/shipments/all', { params: { status } }),
    updateStatus: (id, status) => api.patch(`/shipments/${id}/status`, { status })
};

// Container API (Admin)
export const containerAPI = {
    getAll: () => api.get('/admin/containers'),
    getById: (id) => api.get(`/admin/containers/${id}`),
    optimize: () => api.post('/admin/containers/optimize'),
    reset: (id) => api.post(`/admin/containers/${id}/reset`)
};

// Fleet API (Admin)
export const fleetAPI = {
    getAll: () => api.get('/admin/fleet'),
    getById: (id) => api.get(`/admin/fleet/${id}`),
    calculateExpense: (data) => api.post('/admin/fleet/calculate-expense', data),
    selectVehicle: (data) => api.post('/admin/fleet/select-vehicle', data),
    updateStatus: (id, status) => api.patch(`/admin/fleet/${id}/status`, { status })
};

// Inventory API (Admin)
export const inventoryAPI = {
    getAll: () => api.get('/admin/inventory'),
    getByCategory: (category) => api.get(`/admin/inventory/${category}`),
    update: (category, data) => api.put(`/admin/inventory/${category}`, data),
    restock: (category, quantity) => api.post(`/admin/inventory/${category}/restock`, { quantity })
};

// Financial API (Admin)
export const financialAPI = {
    getSummary: () => api.get('/admin/financial/summary'),
    update: (data) => api.post('/admin/financial/update', data),
    recalculate: () => api.post('/admin/financial/recalculate')
};

// Report API (Admin)
export const reportAPI = {
    generate: () => api.get('/admin/reports/generate'),
    getDashboardStats: () => api.get('/admin/reports/dashboard-stats')
};

export default api;

