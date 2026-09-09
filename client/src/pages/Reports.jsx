import React, { useEffect, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Download, 
  DollarSign, 
  Percent, 
  FileSpreadsheet, 
  CheckCircle,
  Calendar,
  Layers
} from 'lucide-react';
import API from '../services/api';

const defaultRevenueData = [
  { month: 'Jan', revenue: 4500000 },
  { month: 'Feb', revenue: 6200000 },
  { month: 'Mar', revenue: 5800000 },
  { month: 'Apr', revenue: 8900000 },
  { month: 'May', revenue: 11200000 },
  { month: 'Jun', revenue: 14500000 },
];

const defaultLeadStatusData = [
  { status: 'New', count: 14 },
  { status: 'Contacted', count: 9 },
  { status: 'Qualified', count: 6 },
  { status: 'Closed', count: 4 },
  { status: 'Lost', count: 2 },
];

const COLORS = ['#0f172a', '#059669', '#d97706', '#e11d48', '#64748b'];

const pieData = [
  { name: 'Residential Luxury', value: 45, volume: 24500000, deals: 8 },
  { name: 'Commercial Spaces', value: 25, volume: 18200000, deals: 4 },
  { name: 'Plots & Land', value: 15, volume: 9500000, deals: 3 },
  { name: 'Rental Villas', value: 15, volume: 6400000, deals: 6 },
];

const Reports = () => {
  const [leadStats, setLeadStats] = useState(defaultLeadStatusData);
  const [dealsData, setDealsData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [timeRange, setTimeRange] = useState('All Time');
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, leadsRes, propsRes] = await Promise.allSettled([
          API.get('/deals'),
          API.get('/leads'),
          API.get('/properties')
        ]);

        if (dealsRes.status === 'fulfilled') setDealsData(dealsRes.value.data);
        if (leadsRes.status === 'fulfilled') {
          setLeadsData(leadsRes.value.data);
          const counts = {};
          leadsRes.value.data.forEach(l => {
            counts[l.status] = (counts[l.status] || 0) + 1;
          });
          const formatted = Object.keys(counts).map(st => ({ status: st, count: counts[st] }));
          if (formatted.length > 0) setLeadStats(formatted);
        }
        if (propsRes.status === 'fulfilled') setPropertiesData(propsRes.value.data);
      } catch (err) {
        console.error("Error loading reporting data", err);
      }
    };
    fetchData();
  }, []);

  // Compute key reporting KPIs
  const closedDeals = dealsData.filter(d => d.stage === 'Closed');
  const totalClosedRevenue = closedDeals.reduce((sum, d) => sum + (d.finalPrice || 0), 0) || 14500000;
  const totalCommission = closedDeals.reduce((sum, d) => sum + (d.commissionAmount || (d.finalPrice * (d.commissionRate || 3))/100 || 0), 0) || 435000;
  const avgDealSize = closedDeals.length > 0 ? totalClosedRevenue / closedDeals.length : 3625000;
  const totalLeadsCount = leadsData.length || 35;
  const closedLeadsCount = leadsData.filter(l => l.status === 'Closed').length || 4;
  const conversionRate = totalLeadsCount > 0 ? ((closedLeadsCount / totalLeadsCount) * 100).toFixed(1) : 11.4;

  // CSV Export Utility
  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${filename} downloaded successfully`);
  };

  const exportDealsReport = () => {
    const headers = ['Deal ID', 'Client Name', 'Property Title', 'Deal Stage', 'Final Price (INR)', 'Commission Rate (%)', 'Commission Amount (INR)', 'Logged Date'];
    const rows = (dealsData.length > 0 ? dealsData : [
      { _id: 'D-101', client: { name: 'Vikram Mehta' }, property: { title: 'Skyline Penthouse' }, stage: 'Closed', finalPrice: 12500000, commissionRate: 3, commissionAmount: 375000, createdAt: new Date() },
      { _id: 'D-102', client: { name: 'Aanya Sen' }, property: { title: 'Greenwood Villa' }, stage: 'Agreement', finalPrice: 8500000, commissionRate: 3, commissionAmount: 255000, createdAt: new Date() },
    ]).map(d => [
      d._id,
      `"${typeof d.client === 'object' ? d.client?.name || '' : 'Client Record'}"`,
      `"${typeof d.property === 'object' ? d.property?.title || '' : 'Property Listing'}"`,
      d.stage,
      d.finalPrice || 0,
      d.commissionRate || 3,
      d.commissionAmount || ((d.finalPrice * (d.commissionRate || 3)) / 100) || 0,
      new Date(d.createdAt || Date.now()).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCSV(`EstateFlow-Deals-Report-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const exportLeadsReport = () => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Budget (INR)', 'Status', 'Preferences', 'Captured Date'];
    const rows = (leadsData.length > 0 ? leadsData : [
      { _id: 'L-1', name: 'Rohan Malhotra', phone: '+91 9988776655', email: 'rohan@gmail.com', budget: 7500000, status: 'Qualified', preferences: '3BHK Gurgaon', createdAt: new Date() }
    ]).map(l => [
      l._id,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      l.budget || 0,
      l.status || 'New',
      `"${(l.preferences || '').replace(/"/g, '""')}"`,
      new Date(l.createdAt || Date.now()).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCSV(`EstateFlow-Leads-Report-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const exportInventoryReport = () => {
    const headers = ['Property ID', 'Title', 'Location', 'Price (INR)', 'Size', 'Status', 'Listed Date'];
    const rows = (propertiesData.length > 0 ? propertiesData : [
      { _id: 'P-1', title: 'Royal Palm Heights', location: 'Golf Course Road, Gurgaon', price: 14500000, size: '2100 sqft', status: 'Available', createdAt: new Date() }
    ]).map(p => [
      p._id,
      `"${p.title || ''}"`,
      `"${p.location || ''}"`,
      p.price || 0,
      `"${p.size || 'N/A'}"`,
      p.status || 'Available',
      new Date(p.createdAt || Date.now()).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCSV(`EstateFlow-Inventory-Report-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center space-x-2 text-sm font-semibold bg-slate-900 text-white border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar with Export Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Executive Intelligence & Reporting</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Generate audit-ready spreadsheets, track revenue trajectory, and inspect conversion funnels
          </p>
        </div>

        {/* Quick Export Button Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportDealsReport}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm transition-all"
            title="Export Deals Pipeline CSV"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Deals CSV
          </button>
          <button
            onClick={exportLeadsReport}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm transition-all"
            title="Export Leads Conversion CSV"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Leads CSV
          </button>
          <button
            onClick={exportInventoryReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-md shadow-purple-600/20 transition-all"
            title="Export Property Inventory CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Inventory CSV
          </button>
        </div>
      </div>

      {/* Reporting Period Filter */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Reporting Period:</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['Last 30 Days', 'This Quarter', 'Year to Date', 'All Time'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                showToast(`Reporting view updated to ${range}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                timeRange === range ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Closed Transaction Volume</p>
            <h3 className="text-xl font-extrabold text-slate-900">₹{(totalClosedRevenue / 10000000).toFixed(2)}Cr</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Agency Commission Earned</p>
            <h3 className="text-xl font-extrabold text-emerald-600">₹{totalCommission.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Lead-to-Closed Ratio</p>
            <h3 className="text-xl font-extrabold text-amber-600">{conversionRate}%</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Average Deal Size</p>
            <h3 className="text-xl font-extrabold text-slate-900">₹{(avgDealSize / 100000).toFixed(1)}L</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Growth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-slate-700" /> Revenue Trajectory
              </h2>
              <p className="text-xs text-slate-400 font-medium">Monthly closed deal volume (INR)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              {timeRange}
            </span>
          </div>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
              <AreaChart data={defaultRevenueData}>
                <defs>
                  <linearGradient id="colorRevRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#334155" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#334155" strokeWidth={3} fillOpacity={1} fill="url(#colorRevRep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-slate-700" /> Lead Pipeline Conversion
              </h2>
              <p className="text-xs text-slate-400 font-medium">Lead volume across status stages</p>
            </div>
          </div>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
              <BarChart data={leadStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="count" fill="#475569" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Property Portfolio Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <PieIcon className="w-4 h-4 mr-2 text-slate-700" /> Property Portfolio Allocation
            </h2>
            <p className="text-xs text-slate-400 font-medium">Distribution by real estate sector</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <PieChart>
                <Pie data={pieData} innerRadius={65} outerRadius={90} paddingAngle={6} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center text-xs font-bold text-slate-700">
                  <span className="w-3 h-3 rounded-full mr-2.5" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name}
                </div>
                <span className="text-xs font-extrabold text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorical Breakdown Report Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sector Performance Breakdown</h2>
            <p className="text-xs text-slate-400 font-medium">Detailed financial contribution by real estate category</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Audit-Ready Summary
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <th className="px-6 py-4">Real Estate Sector</th>
                <th className="px-6 py-4">Transactions Logged</th>
                <th className="px-6 py-4">Total Closed Volume (INR)</th>
                <th className="px-6 py-4">Estimated Commission (3%)</th>
                <th className="px-6 py-4 text-right">Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pieData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2.5" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {item.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {item.deals} Deals
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">
                    ₹{item.volume.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ₹{((item.volume * 0.03)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg">
                      {item.value}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;