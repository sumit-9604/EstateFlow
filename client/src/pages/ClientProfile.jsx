import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, ArrowLeft, MessageSquare, Clock } from 'lucide-react';
import API from '../services/api';

const ClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [interactionType, setInteractionType] = useState('Call');

  const fetchClientData = async () => {
    try {
      const res = await API.get(`/clients/${id}`);
      setClient(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching client profile", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const res = await API.post(`/clients/${id}/interactions`, { note: newNote, interactionType });
      setClient(res.data);
      setNewNote('');
    } catch (err) {
      alert('Error adding interaction note');
    }
  };

  if (loading) return (
    <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-slate-400 font-bold text-sm">Loading Client Profile...</div>
    </div>
  );

  if (!client) return (
    <div className="p-8 bg-slate-50 min-h-screen text-center">
      <div className="text-rose-500 font-bold text-lg mb-4">Client not found.</div>
      <Link to="/clients" className="text-indigo-600 font-bold underline text-sm">Back to Clients Directory</Link>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/clients" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Client Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
              {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{client.name}</h2>
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 ${
                client.type === 'Buyer' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {client.type}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 font-medium mb-6">
            <p className="flex items-center"><Mail className="w-4 h-4 mr-2.5 text-slate-400" /> {client.email}</p>
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2.5 text-slate-400" /> {client.phone}</p>
          </div>

          {client.preferences && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <h3 className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">Preferences</h3>
              {client.preferences.budget > 0 && <div><span className="text-slate-400">Budget:</span> <span className="font-bold text-slate-900">₹{client.preferences.budget.toLocaleString('en-IN')}</span></div>}
              {client.preferences.location && <div><span className="text-slate-400">Preferred Area:</span> <span className="font-semibold text-slate-800">{client.preferences.location}</span></div>}
              {client.preferences.propertyType && <div><span className="text-slate-400">Type:</span> <span className="font-semibold text-slate-800">{client.preferences.propertyType}</span></div>}
            </div>
          )}
        </div>

        {/* Right Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Note Input */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-slate-700" /> Log New Client Note
            </h3>
            <form onSubmit={handleAddLog} className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-purple-600"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Visit">Site Visit</option>
                  <option value="Inquiry">Inquiry</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Record conversation outcome or scheduled follow-up..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-purple-600"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm">
                  Log
                </button>
              </div>
            </form>
          </div>

          {/* Timeline View */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-slate-700" /> Activity & Interaction Timeline
            </h3>

            {client.interactionHistory && client.interactionHistory.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                {client.interactionHistory.map((log, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-800 border-4 border-white shadow-sm" />
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                          {log.interactionType || 'Interaction'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(log.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed mt-2">
                        "{log.note}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No interaction logs recorded for this client yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;