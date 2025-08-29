import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintsApi } from '../services/api';
import { Complaint } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ComplaintForm from '../components/complaints/ComplaintForm';
import { AlertCircle, Plus, Clock, User, Filter, Search } from 'lucide-react';

const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintsApi.getAll();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return '🔧';
      case 'billing':
        return '💳';
      case 'product':
        return '📦';
      case 'service':
        return '🤝';
      default:
        return '❓';
    }
  };

  const handleAddComplaint = () => {
    setEditingComplaint(undefined);
    setShowForm(true);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setShowForm(true);
  };

  const handleSaveComplaint = async (complaintData: Partial<Complaint>) => {
    setFormLoading(true);
    try {
      if (editingComplaint) {
        // Update existing complaint
        const updatedComplaint = { ...editingComplaint, ...complaintData, updatedAt: new Date().toISOString() };
        setComplaints(prev => prev.map(c => c.id === editingComplaint.id ? updatedComplaint : c));
      } else {
        // Create new complaint
        const newComplaint = await complaintsApi.create({
          ...complaintData,
          customerId: user?.id || '1',
          organizationId: user?.organizationId || 'org1',
          status: 'open'
        } as Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>);
        setComplaints(prev => [newComplaint, ...prev]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save complaint:', error);
    } finally {
      setFormLoading(false);
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
            {user?.role === 'customer' ? 'My Complaints' : 'Complaints Management'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'customer' 
              ? 'Track your submitted complaints' 
              : 'Manage and resolve customer complaints'
            }
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          <span onClick={handleAddComplaint}>
            {user?.role === 'customer' ? 'Submit Complaint' : 'Add Complaint'}
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState
            icon={AlertCircle}
            title="No complaints found"
            description={user?.role === 'customer' 
              ? "You haven't submitted any complaints yet." 
              : "No complaints match your current filters."
            }
            action={{
              label: user?.role === 'customer' ? 'Submit Complaint' : 'Add Complaint',
              onClick: handleAddComplaint
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(complaint.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{complaint.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Created {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                      {complaint.assignedTo && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Assigned to: {complaint.assignedTo}
                        </div>
                      )}
                      <div className="capitalize">
                        Type: {complaint.type}
                      </div>
                    </div>
                  </div>
                  
                  <button className="ml-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    View Details
                  </button>
                  
                  {(user?.role !== 'customer' || complaint.customerId === user?.id) && (
                    <button 
                      onClick={() => handleEditComplaint(complaint)}
                      className="ml-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <ComplaintForm
          complaint={editingComplaint}
          onSave={handleSaveComplaint}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;