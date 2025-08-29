import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { leadsApi } from '../services/api';
import { Lead } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import LeadForm from '../components/leads/LeadForm';
import { UserPlus, Search, Filter, Plus, Phone, Mail, Building, Star } from 'lucide-react';

const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadsApi.getAll();
        setLeads(data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddLead = () => {
    setEditingLead(undefined);
    setShowForm(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleSaveLead = async (leadData: Partial<Lead>) => {
    setFormLoading(true);
    try {
      if (editingLead) {
        const updatedLead = await leadsApi.update(editingLead.id, leadData);
        setLeads(prev => prev.map(l => l.id === editingLead.id ? updatedLead : l));
      } else {
        const newLead = await leadsApi.create({
          ...leadData,
          organizationId: user?.organizationId || 'org1',
          customerId: user?.id || '1'
        } as Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>);
        setLeads(prev => [newLead, ...prev]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save lead:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsApi.delete(leadId);
        setLeads(prev => prev.filter(l => l.id !== leadId));
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
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
            {user?.role === 'employee' ? 'My Leads' : 'Leads Management'}
          </h1>
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        {user?.role !== 'customer' && (
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            <span onClick={handleAddLead}>Add Lead</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
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
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState
            icon={UserPlus}
            title="No leads found"
            description="Start by adding your first lead or adjust your search filters."
            action={user?.role !== 'customer' ? {
              label: 'Add Lead',
              onClick: handleAddLead
            } : undefined}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    {lead.company && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building className="w-3 h-3 mr-1" />
                        {lead.company}
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-3 h-3 mr-2" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-2" />
                      {lead.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score}/100
                    </span>
                  </div>
                  {lead.value && (
                    <div className="text-sm font-semibold text-gray-900">
                      ${lead.value.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                  <span>Source: {lead.source}</span>
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>

                {user?.role !== 'customer' && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <LeadForm
          lead={editingLead}
          onSave={handleSaveLead}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default LeadsPage;