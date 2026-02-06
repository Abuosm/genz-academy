import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* Left Side - Hero (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 items-center justify-center overflow-hidden border-r border-slate-100">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-50"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/5 rounded-full blur-[100px]"></div>

        <div className="relative z-10 p-12 text-center text-slate-900">
          <div className="mb-6 inline-flex p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter uppercase text-slate-900">
            Start Your <br />
            <span className="text-indigo-600">Career Journey</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed font-medium">
            Get access to premium courses, community support, and top-tier job opportunities.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-left">
              <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-600/20"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <p className="font-black text-sm text-slate-900">Verified Content</p>
                <p className="text-xs text-slate-500 font-bold">Industry standard curriculum</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-left">
              <div className="p-2 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-600/20"><User className="w-5 h-5" /></div>
              <div>
                <p className="font-black text-sm text-slate-900">Personal Dashboard</p>
                <p className="text-xs text-slate-500 font-bold">Track your progress in real-time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          GenZ Academy Global
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50/30 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 pt-8 pb-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Join GenZ</h2>
            <p className="text-slate-500 font-medium">Create your premium account today</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" required />
              <span className="text-xs text-slate-500 font-medium">I agree to the <a href="#" className="text-indigo-600 font-bold hover:underline">Terms & Privacy Policy</a></span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 pb-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-black hover:text-purple-600 transition-colors pl-1">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
