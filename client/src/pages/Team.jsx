import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Shield, 
  Search, 
  Trash2, 
  X, 
  CheckCircle, 
  Briefcase, 
  Mail, 
  Lock, 
  AlertCircle 
} from 'lucide-react';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Agent'
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Error loading current user', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/users');
      setTeamMembers(res.data);
    } catch (err) {
      showToast('Failed to load team directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/users', formData);
      setTeamMembers([res.data, ...teamMembers]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'Agent' });
      showToast('Team member onboarded successfully!');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error adding team member', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/auth/users/${userId}/role`, { role: newRole });
      setTeamMembers(teamMembers.map(m => m._id === userId ? res.data : m));
      showToast(`Role updated to ${newRole}`);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error updating role', 'error');
    }
  };

  const handleDeleteMember = async (userId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    try {
      await API.delete(`/auth/users/${userId}`);
      setTeamMembers(teamMembers.filter(m => m._id !== userId));
      showToast(`${memberName} removed from team`);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Cannot remove user', 'error');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Agent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'Admin':
        return 'Full System Access & User Management';
      case 'Manager':
        return 'Pipeline Approvals & Performance Analytics';
      case 'Agent':
        return 'Lead Execution & Inventory Management';
      default:
        return 'Basic Access';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalMembers = teamMembers.length;
  const adminCount = teamMembers.filter(m => m.role === 'Admin').length;
  const managerCount = teamMembers.filter(m => m.role === 'Manager').length;
  const agentCount = teamMembers.filter(m => m.role === 'Agent').length;

  const isAdmin = currentUser?.role === 'Admin';

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Team & Role Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage agency personnel, assign operational roles, and enforce permissions
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-purple-600/25 transition-all"
          >
            <UserPlus className="mr-2 w-4 h-4" /> Add Team Member
          </button>
        )}
      </div>

      {/* Role Notice for non-admins */}
      {!isAdmin && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3 text-xs text-amber-800 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>You are viewing the team directory as an <strong>{currentUser?.role || 'Agent'}</strong>. Only agency <strong>Admins</strong> can invite new members or change permission roles.</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Personnel</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalMembers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Agents</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{agentCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Managers</p>
            <h3 className="text-2xl font-extrabold text-amber-600">{managerCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Administrators</p>
            <h3 className="text-2xl font-extrabold text-purple-600">{adminCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-2">Role:</span>
          {['All', 'Admin', 'Manager', 'Agent'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedRole === role ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Team Directory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <th className="px-6 py-4">Team Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Access Scope</th>
                <th className="px-6 py-4">Joined Date</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Loading team directory...
                  </td>
                </tr>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                          {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center">
                            {member.name}
                            {member._id === currentUser?._id && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold rounded-md border border-purple-200">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1 text-slate-400" /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin && member._id !== currentUser?._id ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none ${getRoleBadge(member.role)}`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Agent">Agent</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getRoleBadge(member.role)}`}>
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {getRoleDescription(member.role)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Active Member'}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {member._id !== currentUser?._id ? (
                          <button
                            onClick={() => handleDeleteMember(member._id, member.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic">Current Session</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    No team members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Onboard Team Member</h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">Create credentials and assign agency permissions</p>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="aarav@estateflow.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                >
                  <option value="Agent">Agent (Leads, Properties & Deals creation)</option>
                  <option value="Manager">Manager (Pipeline Oversight & Reports)</option>
                  <option value="Admin">Administrator (Full Access & User Roles)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
