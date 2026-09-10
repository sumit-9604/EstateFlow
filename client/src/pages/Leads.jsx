import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { UserPlus, Search, Trash2, Edit3, X, Phone, Mail, Filter, CheckCircle } from 'lucide-react';
import { mockLeadsList } from '../data/mockData';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', budget: '', preferences: '', status: 'New'
  });
  const [toast, setToast] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await API.get('/leads');
      if (res.data && res.data.length > 0) {
        setLeads(res.data);
      } else {
        setLeads(mockLeadsList);
      }
    } catch (err) {
      setLeads(mockLeadsList);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setFormData({ name: '', phone: '', email: '', budget: '', preferences: '', status: 'New' });
    setShowModal(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      budget: lead.budget || '',
      preferences: lead.preferences || '',
      status: lead.status || 'New'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        const res = await API.put(`/leads/${editingLead._id}`, {
          ...formData,
          budget: Number(formData.budget) || 0
        });
        setLeads(leads.map(l => l._id === editingLead._id ? res.data : l));
        showToast('Lead updated successfully');
      } else {
        const res = await API.post('/leads', {
          ...formData,
          budget: Number(formData.budget) || 0
        });
        setLeads([res.data, ...leads]);
        showToast('Lead created successfully');
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error saving lead', 'error');
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await API.delete(`/leads/${leadId}`);
      setLeads(leads.filter(l => l._id !== leadId));
      showToast('Lead deleted successfully');
    } catch (err) {
      showToast('Could not delete lead', 'error');
    }
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      const res = await API.put(`/leads/${leadId}/status`, { status: newStatus });
      setLeads(leads.map(l => l._id === leadId ? res.data : l));
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-50 text-blue-700 border-blue-200',
      'Contacted': 'bg-amber-50 text-amber-700 border-amber-200',
      'Qualified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Closed': 'bg-purple-50 text-purple-700 border-purple-200',
      'Lost': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone?.includes(searchTerm) ||
                          lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center space-x-2 text-sm font-semibold ${
          toast.type === 'error' ? 'bg-rose-900 text-rose-100 border-rose-700' : 'bg-slate-900 text-white border-slate-700'
        }`}>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Lead Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Track, qualify, and convert potential buyers & sellers</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-purple-600/25 transition-all"
        >
          <UserPlus className="mr-2 w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center"><Filter className="w-3 h-3 mr-1"/> Filter:</span>
          {['All', 'New', 'Contacted', 'Qualified', 'Closed', 'Lost'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedStatus === st ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <th className="px-6 py-4">Client Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Preferences</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5 font-medium">
                        {lead.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-400" />{lead.phone}</span>}
                        {lead.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400" />{lead.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(lead.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Closed">Closed</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ₹{lead.budget ? lead.budget.toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate font-medium">
                      {lead.preferences || '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(lead)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Lead"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingLead ? 'Edit Lead Details' : 'Create New Lead'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Budget (INR)</label>
                  <input
                    type="number"
                    placeholder="7500000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Preferences</label>
                <textarea
                  rows="2"
                  placeholder="e.g. 3BHK Apartment in Gurgaon, South facing"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
                >
                  {editingLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
