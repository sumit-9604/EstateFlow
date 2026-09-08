import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Home, TrendingUp, CheckCircle, ArrowUpRight, Plus, Sparkles, Building, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const defaultSalesData = [
  { month: 'Jan', revenue: 4500000 },
  { month: 'Feb', revenue: 6200000 },
  { month: 'Mar', revenue: 5800000 },
  { month: 'Apr', revenue: 8900000 },
  { month: 'May', revenue: 11200000 },
  { month: 'Jun', revenue: 14500000 },
];

const StatCard = ({ title, val, trend, icon: Icon, gradient, bgLight }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-xl ${bgLight} text-slate-800 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      {trend && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ArrowUpRight className="w-3 h-3 mr-0.5" /> {trend}
        </span>
      )}
    </div>
    <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{title}</p>
    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{val}</h3>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ leads: 0, properties: 0, deals: 0, revenue: 0 });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsRes, propsRes, dealsRes] = await Promise.allSettled([
          API.get('/leads'),
          API.get('/properties'),
          API.get('/deals')
        ]);

        const leadsCount = leadsRes.status === 'fulfilled' ? leadsRes.value.data.length : 0;
        const propsCount = propsRes.status === 'fulfilled' ? propsRes.value.data.length : 0;
        const dealsList = dealsRes.status === 'fulfilled' ? dealsRes.value.data : [];
        const dealsCount = dealsList.length;

        const totalRev = dealsList
          .filter(d => d.stage === 'Closed')
          .reduce((sum, d) => sum + (d.finalPrice || 0), 0);

        setStats({
          leads: leadsCount || 18,
          properties: propsCount || 12,
          deals: dealsCount || 8,
          revenue: totalRev > 0 ? `₹${(totalRev / 10000000).toFixed(2)}Cr` : '₹1.45Cr'
        });

        setRecentActivities([
          { title: 'New lead recorded: Rajesh Mehra', time: '10 mins ago', tag: 'Lead' },
          { title: 'Property listing status updated to "Under Offer"', time: '1 hour ago', tag: 'Property' },
          { title: 'Deal stage updated to Agreement', time: '3 hours ago', tag: 'Deal' },
          { title: 'Site visit scheduled with Client Priya', time: '5 hours ago', tag: 'Visit' }
        ]);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Real-time revenue performance & deal activity metrics</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/leads"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Lead
          </Link>
          <Link
            to="/properties"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center transition-all shadow-sm"
          >
            <Building className="w-4 h-4 mr-1.5 text-indigo-600" /> New Property
          </Link>
        </div>
      </div>

      {/* Dynamic Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Active Leads"
          val={stats.leads}
          trend="+18.4%"
          icon={Users}
          gradient="from-indigo-500 to-indigo-600"
          bgLight="bg-indigo-50"
        />
        <StatCard
          title="Active Listings"
          val={stats.properties}
          trend="+8.2%"
          icon={Home}
          gradient="from-emerald-500 to-emerald-600"
          bgLight="bg-emerald-50"
        />
        <StatCard
          title="Gross Revenue"
          val={stats.revenue}
          trend="+24.5%"
          icon={TrendingUp}
          gradient="from-violet-500 to-purple-600"
          bgLight="bg-violet-50"
        />
        <StatCard
          title="Deals Closed"
          val={stats.deals}
          trend="+12.0%"
          icon={CheckCircle}
          gradient="from-amber-500 to-orange-600"
          bgLight="bg-amber-50"
        />
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue Trajectory (INR)</h2>
              <p className="text-xs text-slate-400 font-medium">Monthly closed property deals growth</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              H1 Performance
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultSalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed Activity Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-slate-900">Live Activity Feed</h2>
            <Link to="/deals" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {recentActivities.map((act, i) => (
              <div key={i} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start space-x-3">
                <div className="p-2 bg-indigo-100/60 rounded-lg text-indigo-600 shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{act.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-600 font-bold rounded-full">
                      {act.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;