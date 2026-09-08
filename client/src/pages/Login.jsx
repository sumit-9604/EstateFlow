import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Agent' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await API.post('/auth/register', formData);
        // Automatically login after successful registration
        const loginRes = await API.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', loginRes.data.token);
        navigate('/');
      } else {
        const res = await API.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      // If demo user doesn't exist yet, attempt to register demo user automatically
      try {
        await API.post('/auth/register', { name: 'Demo Agent', email, password, role: 'Agent' });
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } catch (regErr) {
        setErrorMsg('Failed demo login. Please create an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 text-purple-400 rounded-2xl shadow-xl mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">EstateFlow Platform</h1>
          <p className="text-sm text-slate-400 mt-1">Enterprise Real Estate Suite</p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Mode Tabs */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl mb-6 border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Sumit Sharma"
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="agent@estatecrm.com"
                  className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">User Role</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Agent">Real Estate Agent</option>
                    <option value="Manager">Branch Manager</option>
                    <option value="Admin">System Administrator</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:from-indigo-500 hover:to-indigo-400 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-medium mb-3">Quick Demo Access:</p>
            <button
              type="button"
              onClick={() => handleDemoLogin('agent@demo.com', 'password123')}
              className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Login as Demo Agent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;