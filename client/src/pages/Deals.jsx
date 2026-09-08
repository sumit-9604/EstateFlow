import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ArrowRight, ArrowLeft, Plus, Trash2, X, CheckCircle, Briefcase, Award, TrendingUp } from 'lucide-react';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [clients, setClients] = useState([]);
    const [properties, setProperties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        client: '', property: '', finalPrice: '', commissionRate: '3', stage: 'Negotiation'
    });
    const [toast, setToast] = useState(null);

    const stages = ['Negotiation', 'Agreement', 'Closed'];

    const fetchData = async () => {
        try {
            const [dealsRes, clientsRes, propsRes] = await Promise.allSettled([
                API.get('/deals'),
                API.get('/clients'),
                API.get('/properties')
            ]);
            if (dealsRes.status === 'fulfilled') setDeals(dealsRes.value.data);
            if (clientsRes.status === 'fulfilled') setClients(clientsRes.value.data);
            if (propsRes.status === 'fulfilled') setProperties(propsRes.value.data);
        } catch (err) {
            showToast('Error loading deal pipeline data', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const moveStage = async (id, newStage) => {
        try {
            const res = await API.put(`/deals/${id}/stage`, { stage: newStage }); 
            setDeals(deals.map(d => d._id === id ? res.data : d));
            showToast(`Deal moved to ${newStage}`);
        } catch (err) {
            showToast('Error updating deal stage', 'error');
        }
    };

    const handleDeleteDeal = async (id) => {
        if (!window.confirm("Delete this deal record?")) return;
        try {
            await API.delete(`/deals/${id}`);
            setDeals(deals.filter(d => d._id !== id));
            showToast('Deal record removed');
        } catch (err) {
            showToast('Failed to delete deal', 'error');
        }
    };

    const handleCreateDeal = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/deals', formData);
            setDeals([...deals, res.data]);
            setShowModal(false);
            setFormData({ client: '', property: '', finalPrice: '', commissionRate: '3', stage: 'Negotiation' });
            showToast('New deal logged into pipeline!');
        } catch (err) {
            showToast(err.response?.data?.msg || 'Error creating deal', 'error');
        }
    };

    const totalPipelineValue = deals.reduce((acc, d) => acc + (d.finalPrice || 0), 0);
    const closedCommission = deals
        .filter(d => d.stage === 'Closed')
        .reduce((acc, d) => acc + (d.commissionAmount || (d.finalPrice * (d.commissionRate || 3))/100 || 0), 0);

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

            {/* Header & Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Deal Pipeline</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Kanban board tracking transaction stages & commission earnings</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-indigo-600/25 transition-all"
                >
                    <Plus className="mr-2 w-4 h-4" /> Create Deal
                </button>
            </div>

            {/* Pipeline Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Pipeline Total Value</p>
                        <h3 className="text-xl font-extrabold text-slate-900">₹{totalPipelineValue.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Closed Commission Earned</p>
                        <h3 className="text-xl font-extrabold text-emerald-600">₹{closedCommission.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Active Transactions</p>
                        <h3 className="text-xl font-extrabold text-slate-900">{deals.length} Active Deals</h3>
                    </div>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stages.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const stageColor = stage === 'Negotiation' ? 'border-amber-400 bg-amber-500/10' : stage === 'Agreement' ? 'border-indigo-400 bg-indigo-500/10' : 'border-emerald-400 bg-emerald-500/10';

                    return (
                        <div key={stage} className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <div className="flex items-center space-x-2">
                                    <span className={`w-3 h-3 rounded-full border-2 ${stageColor}`} />
                                    <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">{stage}</h2>
                                </div>
                                <span className="px-2.5 py-0.5 bg-white text-slate-600 text-xs font-bold rounded-full shadow-sm">
                                    {stageDeals.length}
                                </span>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-340px)] pr-1">
                                {stageDeals.length > 0 ? (
                                    stageDeals.map(deal => {
                                        const calculatedComm = deal.commissionAmount || (deal.finalPrice * (deal.commissionRate || 3)) / 100;
                                        const clientName = typeof deal.client === 'object' ? deal.client?.name : 'Client Record';
                                        const propertyTitle = typeof deal.property === 'object' ? deal.property?.title : 'Property Listing';

                                        return (
                                            <div key={deal._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{propertyTitle}</h3>
                                                    <button
                                                        onClick={() => handleDeleteDeal(deal._id)}
                                                        className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Delete Deal"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-500 font-medium mb-4">Client: <span className="text-slate-800 font-semibold">{clientName}</span></p>

                                                <div className="bg-slate-50 p-3 rounded-lg mb-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Deal Value</span>
                                                        <span className="text-sm font-extrabold text-indigo-600">₹{deal.finalPrice?.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Comm ({deal.commissionRate || 3}%)</span>
                                                        <span className="text-xs font-bold text-emerald-600">₹{calculatedComm?.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>

                                                {/* Stage Action Controls */}
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                                                    {stage !== 'Negotiation' ? (
                                                        <button
                                                            onClick={() => moveStage(deal._id, stages[stages.indexOf(stage) - 1])}
                                                            className="flex items-center text-slate-500 hover:text-slate-800 font-semibold"
                                                        >
                                                            <ArrowLeft className="w-3 h-3 mr-1" /> Back
                                                        </button>
                                                    ) : <div />}

                                                    {stage !== 'Closed' && (
                                                        <button
                                                            onClick={() => moveStage(deal._id, stages[stages.indexOf(stage) + 1])}
                                                            className="flex items-center text-indigo-600 hover:text-indigo-800 font-extrabold bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                                                        >
                                                            Next <ArrowRight className="w-3 h-3 ml-1" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl font-medium">
                                        No deals in {stage}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Deal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-slate-100">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Log New Deal Transaction</h2>

                        <form onSubmit={handleCreateDeal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Client *</label>
                                <select
                                    required
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                                >
                                    <option value="">-- Choose Client --</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} ({c.type})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Select Property *</label>
                                <select
                                    required
                                    value={formData.property}
                                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                                >
                                    <option value="">-- Choose Property Listing --</option>
                                    {properties.map(p => (
                                        <option key={p._id} value={p._id}>{p.title} - ₹{p.price?.toLocaleString('en-IN')}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Final Deal Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="7500000"
                                        value={formData.finalPrice}
                                        onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Commission Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        placeholder="3"
                                        value={formData.commissionRate}
                                        onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stage</label>
                                <select
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-600"
                                >
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Agreement">Agreement</option>
                                    <option value="Closed">Closed</option>
                                </select>
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
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
                                >
                                    Start Deal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deals;