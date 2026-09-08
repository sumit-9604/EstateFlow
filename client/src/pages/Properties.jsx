import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { MapPin, Plus, X, Search, Building2, Maximize, Trash2, Eye, CheckCircle } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedPropDetails, setSelectedPropDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', size: '', amenities: '', status: 'Available'
  });
  const [toast, setToast] = useState(null);

  const fetchProperties = async () => {
    try {
      const res = await API.get('/properties');
      setProperties(res.data);
    } catch (err) {
      showToast('Error loading properties', 'error');
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property listing?")) return;
    try {
      await API.delete(`/properties/${id}`);
      setProperties(properties.filter(item => item._id !== id));
      showToast('Property listing removed');
    } catch (err) {
      showToast('Failed to delete property', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    if (file) {
      data.append('images', file);
    }

    try {
      const token = localStorage.getItem('token');
      await API.post('/properties', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      setShowModal(false);
      setFile(null);
      setFormData({ title: '', location: '', price: '', size: '', amenities: '', status: 'Available' });
      fetchProperties();
      showToast('Property published successfully!');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to publish property', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Under Offer': 'bg-amber-50 text-amber-700 border-amber-200',
      'Sold': 'bg-rose-50 text-rose-700 border-rose-200',
      'Rented': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prop.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || prop.status === selectedStatus;
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Property Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Manage premium residential and commercial inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center shadow-lg shadow-purple-600/25 transition-all"
        >
          <Plus className="mr-2 w-4 h-4" /> Add New Property
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Available', 'Under Offer', 'Sold', 'Rented'].map((st) => (
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

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <div key={prop._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group">
              {/* Image Preview Container */}
              <div className="h-52 bg-slate-900 relative overflow-hidden">
                {prop.images && prop.images[0] ? (
                  <img
                    src={`http://localhost:5000${prop.images[0]}`}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full ${prop.images && prop.images[0] ? 'hidden' : 'flex'} flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 p-4`}>
                  <Building2 className="w-12 h-12 text-slate-600 mb-2" />
                  <span className="text-xs font-semibold text-slate-500">No Image Uploaded</span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-md border ${getStatusBadge(prop.status)}`}>
                    {prop.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{prop.title}</h3>
                <div className="flex items-center text-slate-500 text-xs mb-4 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                  <span className="truncate">{prop.location}</span>
                </div>

                {prop.size && (
                  <div className="flex items-center space-x-3 mb-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center"><Maximize className="w-3.5 h-3.5 mr-1 text-slate-400" /> {prop.size}</span>
                  </div>
                )}

                {/* Amenities Badges */}
                {prop.amenities && prop.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(Array.isArray(prop.amenities) ? prop.amenities : String(prop.amenities).split(',')).slice(0, 3).map((am, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {am.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{prop.price?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPropDetails(prop)}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prop._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 font-medium">
            No properties found matching your search.
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Add New Property Listing</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Luxury 3BHK Penthouse"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="Sector 54, Golf Course Road, Gurgaon"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="12500000"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area / Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1850 sqft"
                    value={formData.size}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Listing Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amenities (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Pool, Gym, Parking"
                    value={formData.amenities}
                    onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold"
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
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Property Details Modal */}
      {selectedPropDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedPropDetails(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">{selectedPropDetails.title}</h2>
            <p className="text-xs text-slate-500 flex items-center mb-4"><MapPin className="w-3.5 h-3.5 mr-1" />{selectedPropDetails.location}</p>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm text-slate-700 mb-4">
              <div className="flex justify-between"><span className="text-slate-400 text-xs font-semibold">Price:</span> <span className="font-bold text-indigo-600">₹{selectedPropDetails.price?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-xs font-semibold">Size:</span> <span>{selectedPropDetails.size || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 text-xs font-semibold">Status:</span> <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${getStatusBadge(selectedPropDetails.status)}`}>{selectedPropDetails.status}</span></div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPropDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
