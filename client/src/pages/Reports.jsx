import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';
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
  { name: 'Residential Luxury', value: 45 },
  { name: 'Commercial Spaces', value: 25 },
  { name: 'Plots & Land', value: 15 },
  { name: 'Rental Villas', value: 15 },
];

const Reports = () => {
  const [leadStats, setLeadStats] = useState(defaultLeadStatusData);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/leads');
        if (res.data && res.data.length > 0) {
          const counts = {};
          res.data.forEach(l => {
            counts[l.status] = (counts[l.status] || 0) + 1;
          });
          const formatted = Object.keys(counts).map(st => ({ status: st, count: counts[st] }));
          setLeadStats(formatted);
        }
      } catch (err) {
        // Fallback to default stats
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Intelligence</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Deep insights into revenue velocity, lead conversion, and property distribution</p>
      </div>

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
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <PieIcon className="w-4 h-4 mr-2 text-slate-700" /> Property Portfolio Allocation
            </h2>
            <p className="text-xs text-slate-400 font-medium">Distribution by real estate sector</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
};

export default Reports;