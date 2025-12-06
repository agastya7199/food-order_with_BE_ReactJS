const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Make API request with auth token
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const error = await response.json();
                errorMessage = error.message || `Request failed with status ${response.status}`;
            } catch (e) {
                errorMessage = `Request failed with status ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Auth API
export const register = async (email, password, fullName) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
    });
};

export const login = async (email, password) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

// Meals API
export const getMeals = async () => {
    return apiRequest('/meals');
};

// Orders API
export const createOrder = async (items, total, deliveryAddress) => {
    return apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({ items, total, deliveryAddress }),
    });
};

export const getUserOrders = async () => {
    return apiRequest('/orders');
};

// Profile API
export const getProfile = async () => {
    return apiRequest('/auth/profile');
};

export const updateProfile = async (fullName, address) => {
    return apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName, address }),
    });
};

export const changePassword = async (currentPassword, newPassword) => {
    return apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
};
