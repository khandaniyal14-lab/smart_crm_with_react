import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  Bot,
  CreditCard,
  Settings,
  Building2,
  AlertCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ];

    switch (user?.role) {
      case 'system_admin':
        return [
          ...baseItems,
          { path: '/organizations', icon: Building2, label: 'Organizations' },
          { path: '/users', icon: Users, label: 'All Users' },
          { path: '/leads', icon: UserPlus, label: 'All Leads' },
          { path: '/complaints', icon: AlertCircle, label: 'All Complaints' },
          { path: '/subscription', icon: CreditCard, label: 'Subscriptions' }
        ];
      case 'org_admin':
        return [
          ...baseItems,
          { path: '/users', icon: Users, label: 'Team Members' },
          { path: '/leads', icon: UserPlus, label: 'Leads' },
          { path: '/complaints', icon: AlertCircle, label: 'Complaints' },
          { path: '/chatbot', icon: Bot, label: 'AI Assistant' },
          { path: '/subscription', icon: CreditCard, label: 'Subscription' }
        ];
      case 'employee':
        return [
          ...baseItems,
          { path: '/leads', icon: UserPlus, label: 'My Leads' },
          { path: '/complaints', icon: AlertCircle, label: 'My Complaints' },
          { path: '/chatbot', icon: Bot, label: 'AI Assistant' }
        ];
      case 'customer':
        return [
          { path: '/complaints', icon: MessageSquare, label: 'My Complaints' },
          { path: '/chatbot', icon: Bot, label: 'Support Chat' }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart CRM</h1>
            <p className="text-sm text-gray-500">
              {user?.role === 'system_admin' && 'System Admin'}
              {user?.role === 'org_admin' && 'Organization Admin'}
              {user?.role === 'employee' && 'Employee'}
              {user?.role === 'customer' && 'Customer Portal'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;