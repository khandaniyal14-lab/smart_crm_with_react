import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import UserForm from '../components/users/UserForm';
import { Users, Plus, Search, Filter, UserCheck, UserX, Mail, Calendar } from 'lucide-react';

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  // Mock users data
  const mockUsers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@company.com',
      role: 'org_admin' as const,
      organizationId: 'org1',
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@company.com',
      role: 'employee' as const,
      organizationId: 'org1',
      isActive: true,
      createdAt: '2024-01-12T00:00:00Z'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike@company.com',
      role: 'employee' as const,
      organizationId: 'org1',
      isActive: false,
      createdAt: '2024-01-08T00:00:00Z'
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Brown',
      email: 'emma@customer.com',
      role: 'customer' as const,
      organizationId: 'org1',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z'
    }
  ];

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && u.isActive) ||
      (statusFilter === 'inactive' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      system_admin: 'bg-purple-100 text-purple-800',
      org_admin: 'bg-blue-100 text-blue-800',
      employee: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      system_admin: 'System Admin',
      org_admin: 'Organization Admin',
      employee: 'Employee',
      customer: 'Customer'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSaveUser = async (userData: any) => {
    setFormLoading(true);
    try {
      // Convert camelCase to snake_case for backend
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role,
        is_active: userData.isActive,
        organization_id: user?.organizationId || "org1",
        password: userData.password || "Temp1234!" // optional temp password
      };

      if (editingUser) {
        // Update existing user
        const response = await fetch(`http://localhost:8000/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const updatedUser = await response.json();
        console.log("Updated user:", updatedUser);
      } else {
        // Create new user
        const response = await fetch("http://localhost:8000/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const newUser = await response.json();
        console.log("Created user:", newUser);
      }

      setShowForm(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setFormLoading(false);
    }
  };


  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) {
      console.log(`${currentStatus ? 'Suspending' : 'Activating'} user:`, userId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'system_admin' ? 'All Users' : 'Team Members'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'system_admin'
              ? 'Manage users across all organizations'
              : 'Manage your team members and customers'
            }
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          <span onClick={handleAddUser}>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              {user?.role === 'system_admin' && (
                <option value="system_admin">System Admin</option>
              )}
              <option value="org_admin">Organization Admin</option>
              <option value="employee">Employee</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState
            icon={Users}
            title="No users found"
            description="No users match your current search filters."
            action={{
              label: 'Add User',
              onClick: handleAddUser
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {u.firstName[0]}{u.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {u.isActive ? (
                          <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <UserX className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm ${u.isActive ? 'text-green-800' : 'text-red-800'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                        className={`${u.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
          currentUserRole={user?.role || 'employee'}
        />
      )}
    </div>
  );
};

export default UsersPage;