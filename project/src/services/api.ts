import axios from 'axios';
import { Lead, Complaint, DashboardStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // match FastAPI prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ Leads API ------------------
export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const res = await api.get('/v1/leads/');
    return res.data;
  },
  getById: async (id: string): Promise<Lead> => {
    const res = await api.get(`/v1/leads/${id}`);
    return res.data;
  },
  create: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    const res = await api.post('/v1/leads/', lead);
    return res.data;
  },
  update: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    const res = await api.put(`/v1/leads/${id}`, updates);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/leads/${id}`);
  }
};

// ------------------ Complaints API ------------------
export const complaintsApi = {
  getAll: async (): Promise<Complaint[]> => {
    const res = await api.get('/v1/complaints/');
    return res.data;
  },
  create: async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Complaint> => {
    const res = await api.post('/v1/complaints/', complaint);
    return res.data;
  }
};

// ------------------ Chatbot API ------------------
export const chatbotApi = {
  sendMessage: async (message: string): Promise<string> => {
    const res = await api.post('/v1/chatbot/query', { message });
    return res.data.response;
  }
};

// ------------------ Dashboard API ------------------
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const res = await api.get('/v1/dashboard/stats');
      return res.data;
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      return {
        totalLeads: 0,
        activeComplaints: 0,
        conversionRate: 0,
        avgResponseTime: 0,
        monthlyLeads: Array(12).fill(0),
        recentActivities: []
      };
    }
  }
};

export default api;
