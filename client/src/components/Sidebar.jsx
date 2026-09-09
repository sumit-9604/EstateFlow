import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Briefcase, 
  BarChart3, 
  UserCheck, 
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        // Fallback user if token info exists in localStorage
      }
    };
    fetchMe();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Properties', icon: Home, path: '/properties' },
    { name: 'Deals Pipeline', icon: Briefcase, path: '/deals' },
    { name: 'Clients', icon: UserCheck, path: '/clients' },
    { name: 'Analytics & Reports', icon: BarChart3, path: '/reports' },
    { name: 'Team & Roles', icon: ShieldCheck, path: '/team' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-200 flex flex-col fixed left-0 top-0 z-30 shadow-xl border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 bg-slate-800 rounded-xl text-purple-400 border border-slate-700/60 shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-white tracking-wide font-sans">
            Estate<span className="text-purple-400">Flow</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Real Estate CRM</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group font-medium text-sm relative ${
                isActive
                  ? 'bg-slate-800/90 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              {isActive && (
                <span className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-purple-500 rounded-full" />
              )}
              <item.icon className={`w-5 h-5 mr-3.5 transition-transform duration-200 ${isActive ? 'text-purple-400 scale-105' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Badge & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2.5">
        <div className="flex items-center p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Agent'}</p>
            <span className="inline-flex items-center text-[10px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors rounded-xl group"
        >
          <LogOut className="w-4 h-4 mr-2.5 group-hover:scale-105 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;