import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to every outgoing request
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('foodiehub_user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear saved token if expired
      const user = localStorage.getItem('foodiehub_user');
      if (user && error.config.url !== '/users/login') {
        localStorage.removeItem('foodiehub_user');
        window.dispatchEvent(new Event('authChange'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const res = await API.post('/users/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await API.post('/users/register', userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await API.get('/users/profile');
    return res.data;
  },
  getAllUsers: async () => {
    const res = await API.get('/users');
    return res.data;
  }
};

// Food Service
export const foodService = {
  getAll: async (params = {}) => {
    const res = await API.get('/foods', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/foods/${id}`);
    return res.data;
  },
  create: async (foodData) => {
    const res = await API.post('/foods', foodData);
    return res.data;
  },
  update: async (id, foodData) => {
    const res = await API.put(`/foods/${id}`, foodData);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/foods/${id}`);
    return res.data;
  }
};

// Category Service
export const categoryService = {
  getAll: async () => {
    const res = await API.get('/categories');
    return res.data;
  },
  create: async (data) => {
    const res = await API.post('/categories', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/categories/${id}`);
    return res.data;
  }
};

// Order Service
export const orderService = {
  create: async (orderData) => {
    const res = await API.post('/orders', orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await API.get('/orders/myorders');
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/orders/${id}`);
    return res.data;
  },
  getAll: async (params = {}) => {
    const res = await API.get('/orders', { params });
    return res.data;
  },
  updateStatus: async (id, status, paymentStatus) => {
    const res = await API.put(`/orders/${id}/status`, { status, paymentStatus });
    return res.data;
  },
  getAdminStats: async () => {
    const res = await API.get('/orders/admin/stats');
    return res.data;
  }
};

export default API;

