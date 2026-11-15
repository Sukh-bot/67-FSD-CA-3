/**
 * API Client for Program 5 Full-Stack Integration
 * Connects React frontend to Express backend
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001/api';

/**
 * Generic Fetch wrapper with JSON handling and JWT Bearer token injection
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('PETCARE_AUTH_TOKEN');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP ${response.status} Error`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Appointments
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/appointments${query ? `?${query}` : ''}`);
  },
  getAppointmentById: (id) => apiRequest(`/appointments/${id}`),
  createAppointment: (payload) => apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateAppointment: (id, payload) => apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteAppointment: (id) => apiRequest(`/appointments/${id}`, {
    method: 'DELETE'
  }),
  getStats: () => apiRequest('/appointments/stats'),

  // Auth
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getMe: () => apiRequest('/auth/me'),

  // Health
  checkHealth: () => apiRequest('/health')
};
