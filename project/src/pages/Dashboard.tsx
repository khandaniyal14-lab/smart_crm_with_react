import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import { DashboardStats } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TrendingUp, Users, AlertCircle, Clock, UserPlus, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'system_admin':
        return 'System Overview';
      case 'org_admin':
        return 'Organization Dashboard';
      case 'employee':
        return 'Your Dashboard';
      case 'customer':
        return 'Customer Portal';
      default:
        return 'Dashboard';
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: UserPlus,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Complaints',
      value: stats?.activeComplaints || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-8%'
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Avg Response Time',
      value: `${stats?.avgResponseTime || 0}h`,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className={`text-sm mt-2 ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change} from last month
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Leads Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Leads</h3>
          <div className="h-64 flex items-end space-x-2">
            {stats?.monthlyLeads?.map((value, index) => (
              <div key={index} className="flex-1 bg-blue-100 rounded-t" style={{ height: `${(value / 100) * 100}%` }}>
                <div className="bg-blue-500 rounded-t h-full flex items-end justify-center text-white text-xs pb-1">
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {stats?.recentActivities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'lead' ? 'bg-blue-100' : 
                  activity.type === 'complaint' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {activity.type === 'lead' ? (
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  ) : activity.type === 'complaint' ? (
                    <MessageSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Users className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role !== 'customer' && (
            <button 
              onClick={() => navigate('/leads')}
              className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add New Lead</p>
              <p className="text-sm text-gray-500">Create a new lead record</p>
            </button>
          )}
          
          <button 
            onClick={() => navigate('/complaints')}
            className="p-4 border border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
            <p className="font-medium text-gray-900">
              {user?.role === 'customer' ? 'Submit Complaint' : 'View Complaints'}
            </p>
            <p className="text-sm text-gray-500">
              {user?.role === 'customer' ? 'Report an issue' : 'Manage open complaints'}
            </p>
          </button>

          <button 
            onClick={() => navigate('/chatbot')}
            className="p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
          >
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">AI Assistant</p>
            <p className="text-sm text-gray-500">Get help from AI chatbot</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;