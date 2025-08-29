export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'system_admin' | 'org_admin' | 'employee' | 'customer';
  organizationId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  subscriptionTier: 'free' | 'premium';
  isActive: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  score: number;
  assignedTo?: string;
  source: string;
  value?: number;
  notes?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service' | 'billing' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  customerId: string;
  assignedTo?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeComplaints: number;
  conversionRate: number;
  avgResponseTime: number;
  monthlyLeads: number[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'lead' | 'complaint' | 'user';
  action: string;
  description: string;
  timestamp: string;
}