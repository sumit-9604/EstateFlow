import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { User, Phone, Mail, History, Plus, Search, MessageSquare, ExternalLink, Trash2, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);
    const [selectedClientForLog, setSelectedClientForLog] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', type: 'Buyer', budget: '', location: '', propertyType: ''
    });
    const [interactionData, setInteractionData] = useState({ note: '', interactionType: 'Call' });
    const [toast, setToast] = useState(null);

    const fetchClients = async () => {
        try {
            const res = await API.get('/clients');
            setClients(res.data);
        } catch (err) {
            showToast('Error loading client list', 'error');
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: formData.type,
                preferences: {
                    budget: Number(formData.budget) || 0,
                    location: formData.location,
                    propertyType: formData.propertyType
                }
            };
            const res = await API.post('/clients', payload);
            setClients([res.data, ...clients]);
            setShowAddModal(false);
            setFormData({ name: '', email: '', phone: '', type: 'Buyer', budget: '', location: '', propertyType: '' });
            showToast('Client profile created!');
        } catch (err) {
            showToast(err.response?.data?.msg || 'Error creating client', 'error');
        }
    };

    const handleLogInteraction = async (e) => {
        e.preventDefault();
        if (!selectedClientForLog) return;
        try {
            const res = await API.post(`/clients/${selectedClientForLog._id}/interactions`, interactionData);
            setClients(clients.map(c => c._id === selectedClientForLog._id ? res.data : c));
            setShowInteractionModal(false);
            setInteractionData({ note: '', interactionType: 'Call' });
            showToast('Interaction logged successfully!');
        } catch (err) {
            showToast('Failed to log interaction', 'error');
        }
    };

    const handleDeleteClient = async (id) => {
        if (!window.confirm("Are you sure you want to remove this client?")) return;
        try {
            await API.delete(`/clients/${id}`);
            setClients(clients.filter(c => c._id !== id));
            showToast('Client profile removed');
        } catch (err) {
            showToast('Error deleting client', 'error');
        }
    };

    const filteredClients = clients.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

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

            {/* Header & Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Client Directory</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Manage client portfolios & track interaction history</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-purple-600/25 transition-all"
                >
                    <Plus className="mr-2 w-4 h-4" /> Add New Client
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-md">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search clients by name, email, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* Client Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <div key={client._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{client.name}</h2>
                                    <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 ${
                                        client.type === 'Buyer' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}>
                                        {client.type}
                                    </span>
                                </div>
                                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-2 text-xs text-slate-600 mb-6 font-medium">
                                <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {client.email}</p>
                                <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {client.phone}</p>
                            </div>

                            {/* Recent Interaction */}
                            <div className="mt-auto pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl mb-4">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
                                    <History className="w-3 h-3 mr-1 text-slate-400" /> Recent Interaction
                                </h3>
                                {client.interactionHistory && client.interactionHistory.length > 0 ? (
                                    <p className="text-xs text-slate-700 italic line-clamp-2">
                                        "{client.interactionHistory[0].note}" — <span className="text-[10px] text-slate-400 font-semibold">{new Date(client.interactionHistory[0].date).toLocaleDateString()}</span>
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No interactions logged yet</p>
                                )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-2">
                                <button
                                    onClick={() => { setSelectedClientForLog(client); setShowInteractionModal(true); }}
                                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Log Contact
                                </button>

                                <div className="flex items-center space-x-2">
                                    <Link
                                        to={`/clients/${client._id}`}
                                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="View Profile Details"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClient(client._id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete Client"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 font-medium">
                        No clients found matching your search.
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-slate-100">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Register New Client Profile</h2>

                        <form onSubmit={handleCreateClient} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Rohan Malhotra"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="rohan@gmail.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="+91 99887 76655"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Client Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                    >
                                        <option value="Buyer">Buyer</option>
                                        <option value="Seller">Seller</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Budget (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="15000000"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                    />
                                </div>
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
                                    Save Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Log Interaction Modal */}
            {showInteractionModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100">
                        <button
                            onClick={() => setShowInteractionModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-extrabold text-slate-900 mb-1">Log Client Interaction</h2>
                        <p className="text-xs text-slate-500 mb-4">Record notes for {selectedClientForLog?.name}</p>

                        <form onSubmit={handleLogInteraction} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Interaction Type</label>
                                <select
                                    value={interactionData.interactionType}
                                    onChange={e => setInteractionData({ ...interactionData, interactionType: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                >
                                    <option value="Call">Phone Call</option>
                                    <option value="Email">Email Communication</option>
                                    <option value="Visit">Site Visit</option>
                                    <option value="Inquiry">General Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Interaction Notes *</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Discussed pricing options for Villa Royal project, client requested callback on Friday."
                                    value={interactionData.note}
                                    onChange={e => setInteractionData({ ...interactionData, note: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                                />
                            </div>

                            <div className="pt-2 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInteractionModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30"
                                >
                                    Log Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;