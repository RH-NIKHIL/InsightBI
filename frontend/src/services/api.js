const API_BASE = 'http://localhost:5000/api';

// ── Helper: make fetch request with auth token ──
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('insightbi_token') || localStorage.getItem('insightbi_user_token') || localStorage.getItem('insightbi_staff_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// ── Auth API (Admin) ──
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  getProfile: () => request('/auth/profile'),

  updateProfile: (data) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Staff management endpoints
  createStaff: (name, email, password) =>
    request('/auth/create-staff', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  getStaffList: () => request('/auth/staff-list'),

  deleteStaff: (staffId) =>
    request(`/auth/delete-staff/${staffId}`, { method: 'DELETE' }),
};

// ── User Auth API ──
export const userAuthAPI = {
  login: (email, password) =>
    request('/user-auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password) =>
    request('/user-auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  getProfile: () => request('/user-auth/profile'),

  getDashboard: () => request('/user-auth/dashboard'),
};

// ── Staff Auth API ──
export const staffAuthAPI = {
  login: (email, password) =>
    request('/staff-auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getProfile: () => request('/staff-auth/profile'),
};

// ── Billing Staff API ──
export const billingStaffAPI = {
  getProducts: () => request('/billing/products'),
  createBill: (data) => request('/billing/create', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/billing/history'),
};

// ── Dashboard API ──
export const dashboardAPI = {
  getData: () => request('/dashboard'),
};

// ── Customer Satisfaction API ──
export const csatAPI = {
  getData: () => request('/customer-satisfaction'),
  analyze: () => request('/customer-satisfaction/analyze', { method: 'POST' }),
};

// ── Demand Forecast API ──
export const demandAPI = {
  getData: () => request('/demand-forecast'),
  generate: () => request('/demand-forecast/generate', { method: 'POST' }),
};

// ── Price Volatility API ──
export const priceAPI = {
  getData: () => request('/price-volatility'),
  analyze: () => request('/price-volatility/analyze', { method: 'POST' }),
};

// ── Billing Anomaly API ──
export const billingAPI = {
  getData: () => request('/billing-anomaly'),
  scan: () => request('/billing-anomaly/scan', { method: 'POST' }),
};

// ── Payment API (Razorpay) ──
export const paymentAPI = {
  createOrder: (amount) =>
    request('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
  verify: (data) =>
    request('/payment/verify', { method: 'POST', body: JSON.stringify(data) }),
};

// ── AI Assistant API (Gemini — called directly from AiAssistant component) ──
// The actual streaming logic is in src/components/AiAssistant.js
// This export is for reference and future server-side proxying.
export const aiAPI = {
  // Key is read from process.env.REACT_APP_GEMINI_API_KEY
  getModel: () => 'gemini-1.5-flash',
  getEndpoint: () =>
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent',
};

