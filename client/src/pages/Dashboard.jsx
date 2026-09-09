import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Users, Home, TrendingUp, CheckCircle, ArrowUpRight, Plus, Sparkles, 
  Building, Briefcase, Calendar, MapPin, ArrowRight, Bell, 
  ChevronRight, Flame, CheckCircle2, DollarSign, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  mockDashboardStats, 
  mockRevenueData, 
  mockMarketTrends, 
  mockMarketSummary,
  mockOccupancyData, 
  mockFeaturedProperties, 
  mockTopAgents, 
  mockTodaysTasks, 
  mockConversionFunnel, 
  mockHotLeads, 
  mockLiveActivities 
} from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState(mockDashboardStats);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly'); // 'monthly' | 'quarterly'
  const activeRevenueYear = '2026';
  const [tasks, setTasks] = useState(mockTodaysTasks);
  const [properties, setProperties] = useState(mockFeaturedProperties);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', email: '', phone: '', budget: '', status: 'New' });
  const [newPropData, setNewPropData] = useState({ title: '', location: '', price: '', type: 'Luxury Villa', status: 'Available' });
  const [toastMsg, setToastMsg] = useState(null);

  // Fetch real data to blend with mock fallback seamlessly
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [leadsRes, propsRes, dealsRes] = await Promise.allSettled([
          API.get('/leads'),
          API.get('/properties'),
          API.get('/deals')
        ]);

        const leadsCount = leadsRes.status === 'fulfilled' && leadsRes.value.data ? leadsRes.value.data.length : null;
        const propsData = propsRes.status === 'fulfilled' && propsRes.value.data ? propsRes.value.data : null;
        const dealsList = dealsRes.status === 'fulfilled' && dealsRes.value.data ? dealsRes.value.data : [];

        // Calculate actual closed revenue if deals exist
        const closedDeals = dealsList.filter(d => d.stage === 'Closed');
        const closedRev = closedDeals.reduce((sum, d) => sum + (d.finalPrice || 0), 0);

        setStats(prev => ({
          ...prev,
          activeLeads: {
            ...prev.activeLeads,
            value: leadsCount !== null && leadsCount > 0 ? leadsCount : prev.activeLeads.value,
          },
          activeListings: {
            ...prev.activeListings,
            value: propsData !== null && propsData.length > 0 ? propsData.length : prev.activeListings.value,
          },
          dealsClosed: {
            ...prev.dealsClosed,
            value: closedDeals.length > 0 ? closedDeals.length : prev.dealsClosed.value,
          },
          grossRevenue: {
            ...prev.grossRevenue,
            value: closedRev > 0 ? `₹${(closedRev / 10000000).toFixed(2)} Cr` : prev.grossRevenue.value
          }
        }));

        // If real properties have photos, prioritize showing them
        if (propsData && propsData.length >= 3) {
          const formattedProps = propsData.slice(0, 4).map((p, idx) => ({
            id: p._id || `prop-${idx}`,
            title: p.title || 'Luxury Residence',
            location: p.location || 'Prime City Location',
            price: p.price ? `₹${(p.price >= 10000000 ? (p.price / 10000000).toFixed(2) + ' Cr' : (p.price / 100000).toFixed(1) + ' L')}` : '₹1.2 Cr',
            specs: p.size ? `${p.size} sq.ft` : '3 BHK • 2,400 sq.ft',
            status: p.status || 'Available',
            statusColor: p.status === 'Available' ? 'emerald' : p.status === 'Under Offer' ? 'amber' : 'purple',
            imageUrl: (p.images && p.images[0]) 
              ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000/${p.images[0]}`)
              : mockFeaturedProperties[idx % mockFeaturedProperties.length].imageUrl,
            type: p.status || 'Residential'
          }));
          setProperties(formattedProps);
        }
      } catch (err) {
        console.warn('Using mock dashboard data', err);
      }
    };
    fetchRealData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leads', {
        name: newLeadData.name,
        email: newLeadData.email,
        phone: newLeadData.phone,
        budget: Number(newLeadData.budget) || 12000000,
        status: newLeadData.status
      });
      showToast(`Lead for ${newLeadData.name} created successfully!`);
    } catch (err) {
      showToast(`Lead created locally for ${newLeadData.name}`);
    }
    setStats(prev => ({
      ...prev,
      activeLeads: { ...prev.activeLeads, value: Number(prev.activeLeads.value) + 1 }
    }));
    setIsLeadModalOpen(false);
    setNewLeadData({ name: '', email: '', phone: '', budget: '', status: 'New' });
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await API.post('/properties', {
        title: newPropData.title,
        location: newPropData.location,
        price: Number(newPropData.price) || 15000000,
        status: newPropData.status
      });
      showToast(`Property "${newPropData.title}" listed successfully!`);
    } catch (err) {
      showToast(`Property "${newPropData.title}" listed locally!`);
    }
    setStats(prev => ({
      ...prev,
      activeListings: { ...prev.activeListings, value: Number(prev.activeListings.value) + 1 }
    }));
    setIsPropertyModalOpen(false);
    setNewPropData({ title: '', location: '', price: '', type: 'Luxury Villa', status: 'Available' });
  };

  return (
    <div className="p-5 sm:p-7 lg:p-9 max-w-[1720px] mx-auto space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ==================================================
          TOP HEADER
         ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Executive Overview
            </h1>
            <span className="p-1 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Real-time revenue performance & deal activity metrics
          </p>
        </div>

        {/* Action Controls & Profile Avatar */}
        <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap">
          {/* Notifications Button */}
          <button 
            type="button" 
            onClick={() => showToast("No new unread alerts")}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50/50 shadow-sm transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Add Lead CTA (Purple Primary CTA) */}
          <button
            type="button"
            onClick={() => setIsLeadModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:shadow-purple-500/20 flex items-center space-x-1.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>

          {/* New Property CTA (Dark Navy Secondary CTA) */}
          <button
            type="button"
            onClick={() => setIsPropertyModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md flex items-center space-x-1.5 transition-all duration-200"
          >
            <Building className="w-4 h-4" />
            <span>New Property</span>
          </button>

          {/* Header Avatar Badge */}
          <div 
            onClick={() => navigate('/team')}
            className="cursor-pointer hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              EF
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          TOP 5 KPI CARDS SECTION
         ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* KPI 1: Active Leads */}
        <div 
          onClick={() => navigate('/leads')}
          className="cursor-pointer bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stats.activeLeads.change}
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Active Leads</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{stats.activeLeads.value}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stats.activeLeads.description}</p>
        </div>

        {/* KPI 2: Active Listings / Properties */}
        <div 
          onClick={() => navigate('/properties')}
          className="cursor-pointer bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <Home className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stats.activeListings.change}
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{stats.activeListings.value}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stats.activeListings.description}</p>
        </div>

        {/* KPI 3: Pipeline Value */}
        <div 
          onClick={() => navigate('/deals')}
          className="cursor-pointer bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stats.pipelineValue.change}
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline Value</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{stats.pipelineValue.value}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stats.pipelineValue.description}</p>
        </div>

        {/* KPI 4: Gross Revenue */}
        <div 
          onClick={() => navigate('/reports')}
          className="cursor-pointer bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stats.grossRevenue.change}
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Revenue</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{stats.grossRevenue.value}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stats.grossRevenue.description}</p>
        </div>

        {/* KPI 5: Deals Closed */}
        <div 
          onClick={() => navigate('/deals')}
          className="cursor-pointer bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stats.dealsClosed.change}
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deals Closed</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{stats.dealsClosed.value}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{stats.dealsClosed.description}</p>
        </div>
      </div>

      {/* ==================================================
          MAIN DASHBOARD: TWO COLUMN LAYOUT
          LEFT: Revenue Analytics
          RIGHT: Live Activity Feed
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* REVENUE ANALYTICS CARD */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">Revenue Performance</h2>
              <p className="text-xs text-slate-400 font-medium">Monthly closed property deals</p>
            </div>

            {/* Controls: Year & Period toggle */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-bold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
                {activeRevenueYear}
              </span>
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setRevenuePeriod('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${revenuePeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setRevenuePeriod('quarterly')}
                  className={`px-3 py-1 rounded-lg transition-all ${revenuePeriod === 'quarterly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Quarterly
                </button>
              </div>
            </div>
          </div>

          {/* Area Chart Container with subtle gradient fill */}
          <div className="h-72 sm:h-80 w-full min-w-0 mt-5">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
              <AreaChart data={mockRevenueData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} 
                />
                <Tooltip 
                  cursor={{ stroke: '#c084fc', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs">
                          <p className="font-bold text-purple-300 mb-1">{label} 2026</p>
                          <p className="font-extrabold text-sm text-white">
                            ₹{(payload[0].value / 100000).toFixed(1)} Lakhs
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">Closed Deals: {payload[0].payload.deals}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue2026" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#purpleGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE ACTIVITY FEED */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Live Activity Feed</h2>
              <p className="text-xs text-slate-400 font-medium">Real-time team updates</p>
            </div>
            <Link to="/deals" className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3.5 mt-4 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {mockLiveActivities.map((act) => {
              const tagColors = {
                Lead: 'bg-purple-50 text-purple-700 border-purple-200',
                Property: 'bg-blue-50 text-blue-700 border-blue-200',
                Deal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                Visit: 'bg-amber-50 text-amber-700 border-amber-200',
                Payment: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              };
              return (
                <div 
                  key={act.id} 
                  onClick={() => navigate(act.link)}
                  className="p-3.5 bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl border border-slate-100/80 flex items-start space-x-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-600 group-hover:text-purple-600 group-hover:border-purple-200 transition-colors shrink-0 mt-0.5">
                    {act.type === 'Lead' && <Users className="w-4 h-4" />}
                    {act.type === 'Property' && <Home className="w-4 h-4" />}
                    {act.type === 'Deal' && <Briefcase className="w-4 h-4" />}
                    {act.type === 'Visit' && <Calendar className="w-4 h-4" />}
                    {act.type === 'Client' && <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-purple-900 transition-colors">
                      {act.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                      <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full border ${tagColors[act.tag] || 'bg-slate-100 text-slate-700'}`}>
                        {act.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================
          PROPERTY OVERVIEW (Horizontal Property Cards)
         ================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">Property Overview</h2>
            <p className="text-xs text-slate-400 font-medium">Featured inventory listings & portfolio health</p>
          </div>
          <Link 
            to="/properties" 
            className="inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 group"
          >
            <span>View All Listings</span>
            <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Responsive Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => navigate('/properties')}
              className="bg-white rounded-[22px] border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Container with overlay badge */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src={prop.imageUrl} 
                  alt={prop.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                    prop.status === 'Available'
                      ? 'bg-emerald-500 text-white'
                      : prop.status === 'Under Offer'
                      ? 'bg-amber-500 text-white'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {prop.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                    {prop.type}
                  </span>
                </div>
              </div>

              {/* Property Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {prop.title}
                  </h3>
                  <div className="flex items-center text-xs text-slate-400 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{prop.specs}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                    <span className="text-sm font-extrabold text-slate-900">{prop.price}</span>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          ROW: OCCUPANCY RATE + MARKET TRENDS + TOP AGENTS
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* CARD 1: OCCUPANCY RATE / PROPERTY STATUS (Donut Chart) */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-sans">Occupancy Rate</h2>
            <p className="text-xs text-slate-400 font-medium">Portfolio utilization breakdown</p>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockOccupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockOccupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name) => [`${val}% (${name})`, 'Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 leading-none">74</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Properties</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {mockOccupancyData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px] font-medium">{item.count} units</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: MARKET TRENDS (2025 vs 2026 Area/Line) */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Market Trends</h2>
              <p className="text-xs text-slate-400 font-medium">YoY Price index comparison</p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-bold">
              <span className="inline-flex items-center text-purple-600">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-1"></span> 2026
              </span>
              <span className="inline-flex items-center text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-400 mr-1"></span> 2025
              </span>
            </div>
          </div>

          <div className="h-44 w-full min-w-0 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMarketTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} 
                />
                <Tooltip 
                  formatter={(v, name) => [`₹${v.toLocaleString('en-IN')}`, name === 'y2026' ? '2026 Index' : '2025 Index']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="y2026" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3, fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="y2025" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg for 2025</span>
              <span className="text-sm font-extrabold text-slate-700">{mockMarketSummary.avg2025}</span>
            </div>
            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
              <span className="text-[10px] uppercase font-bold text-purple-600 block">Avg for 2026</span>
              <span className="text-sm font-extrabold text-purple-700">{mockMarketSummary.avg2026}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: TOP PERFORMING AGENTS */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Top Performing Agents</h2>
              <p className="text-xs text-slate-400 font-medium">Leaderboard & closing targets</p>
            </div>
            <Link to="/team" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              Team
            </Link>
          </div>

          <div className="space-y-3.5 mt-4 flex-1">
            {mockTopAgents.map((agent, i) => (
              <div 
                key={agent.id}
                onClick={() => navigate('/team')}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 border border-slate-100/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src={agent.avatar} 
                      alt={agent.name} 
                      className="w-8 h-8 rounded-full object-cover border border-purple-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{agent.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">{agent.revenue}</span>
                    <span className="text-[10px] block text-purple-600 font-semibold">{agent.dealsClosed} deals</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${agent.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================
          ROW: TODAY'S TASKS + HOT LEADS + CONVERSION FUNNEL
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        {/* CRM SECTION 1: TODAY'S TASKS */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Today's Tasks</h2>
              <p className="text-xs text-slate-400 font-medium">Prioritized CRM schedule</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {tasks.filter(t => !t.completed).length} Remaining
            </span>
          </div>

          <div className="space-y-3 mt-4 flex-1">
            {tasks.map((task) => {
              const badgeColors = {
                rose: 'bg-rose-50 text-rose-700 border-rose-200',
                purple: 'bg-purple-50 text-purple-700 border-purple-200',
                blue: 'bg-blue-50 text-blue-700 border-blue-200',
                amber: 'bg-amber-50 text-amber-700 border-amber-200',
              };
              return (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    task.completed 
                      ? 'bg-slate-50/40 border-slate-100 opacity-60' 
                      : 'bg-white border-slate-200/80 hover:border-purple-200 hover:shadow-xs'
                  }`}
                >
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-bold text-slate-900 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{task.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{task.detail}</p>
                    <div className="mt-1.5">
                      <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full border ${badgeColors[task.badgeColor] || 'bg-slate-100 text-slate-700'}`}>
                        {task.badge}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRM SECTION 2: HOT LEADS */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans flex items-center space-x-1.5">
                <span>Hot Leads</span>
                <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              </h2>
              <p className="text-xs text-slate-400 font-medium">High conversion probability</p>
            </div>
            <Link to="/leads" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>

          <div className="space-y-3 mt-4 flex-1">
            {mockHotLeads.map((hl) => (
              <div 
                key={hl.id}
                onClick={() => navigate('/leads')}
                className="p-3.5 bg-slate-50/70 hover:bg-rose-50/30 rounded-2xl border border-slate-100/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-600/15 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                      {hl.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{hl.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{hl.phone}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {hl.temp}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Interest:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{hl.property}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Budget:</span>
                    <span className="font-extrabold text-slate-900 text-xs">{hl.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM SECTION 3: LEAD CONVERSION FUNNEL */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-sans">Lead Conversion Funnel</h2>
            <p className="text-xs text-slate-400 font-medium">Stage-by-stage pipeline velocity</p>
          </div>

          <div className="space-y-2.5 my-3 flex-1 flex flex-col justify-center">
            {mockConversionFunnel.map((step, idx) => (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{step.stage}</span>
                  <div className="space-x-2">
                    <span className="font-extrabold text-slate-900">{step.count}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">({step.rate})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${step.rate}`,
                      backgroundColor: step.color
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Win Rate</span>
            <span className="text-sm font-extrabold text-emerald-600">14.2% Lead-to-Closed Deal</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          MODAL: ADD LEAD DRAWER / DIALOG
         ================================================== */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 relative">
            <button 
              type="button" 
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Capture New Lead</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enter prospective customer information</p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Budget (INR)</label>
                  <input 
                    type="number" 
                    value={newLeadData.budget}
                    onChange={(e) => setNewLeadData({ ...newLeadData, budget: e.target.value })}
                    placeholder="12000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newLeadData.email}
                  onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                  placeholder="vikram@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
                <select
                  value={newLeadData.status}
                  onChange={(e) => setNewLeadData({ ...newLeadData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: NEW PROPERTY DRAWER / DIALOG
         ================================================== */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 relative">
            <button 
              type="button" 
              onClick={() => setIsPropertyModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Add Property Listing</h3>
              <p className="text-xs text-slate-400 mt-0.5">Catalog a new residential or commercial asset</p>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Property Title</label>
                <input 
                  type="text" 
                  required
                  value={newPropData.title}
                  onChange={(e) => setNewPropData({ ...newPropData, title: e.target.value })}
                  placeholder="e.g. Palm Grove Villa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Address</label>
                <input 
                  type="text" 
                  required
                  value={newPropData.location}
                  onChange={(e) => setNewPropData({ ...newPropData, location: e.target.value })}
                  placeholder="Golf Links, New Delhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={newPropData.price}
                    onChange={(e) => setNewPropData({ ...newPropData, price: e.target.value })}
                    placeholder="25000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={newPropData.status}
                    onChange={(e) => setNewPropData({ ...newPropData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Rented">Rented</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all"
                >
                  List Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;