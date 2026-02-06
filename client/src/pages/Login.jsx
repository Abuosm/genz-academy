import React, { useState, useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const Login = () => {
  const { login, socialLogin, isAuthenticated, error, clearErrors } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  useEffect(() => {
    return () => {
      if (clearErrors) clearErrors();
    };
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login({ email, password });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await api.post('/social/google', { idToken: response.credential });
      socialLogin(res.data);
    } catch (err) {
      console.error('Google Auth UI Error:', err);
    }
  };

  const handleGithubLogin = () => {
    const clientId = 'Iv23livV6kP5uT8U9h7A'; // Replace with actual GitHub Client ID
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  // Handle GitHub callback in useEffect if URL has code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const exchangeCode = async () => {
        try {
          const res = await api.post('/social/github', { code });
          socialLogin(res.data);
          // Clear code from URL
          window.history.replaceState({}, document.title, "/login");
        } catch (err) {
          console.error('GitHub Auth Callback Error:', err);
        }
      };
      exchangeCode();
    }
  }, [socialLogin]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-white flex overflow-hidden font-sans">
        {/* Left Side - Visual/Hero (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 items-center justify-center overflow-hidden border-r border-slate-100">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>

          <div className="relative z-10 p-12 text-center flex flex-col items-center">
            {/* Founder Image Card */}
            <div className="mb-10 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <img
                  src="/assets/founder.jpg"
                  alt="Founder"
                  className="w-48 h-48 object-cover rounded-xl"
                />
                <div className="mt-4 pb-2 text-center">
                  <h3 className="font-black text-slate-800 tracking-tight text-xl">Abubakar</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Founder, GenZ Academy</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg border-4 border-white animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-full text-indigo-600 text-sm font-black tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              Empowering the Next Gen
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
              Build Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Legacy Today
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed font-medium">
              "My mission is to provide every student with the tools to build their own future through code."
            </p>
          </div>

          <div className="absolute bottom-10 left-12 text-gray-500 text-sm font-medium">
            © 2026 GenZ Academy. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50/30">
          <div className="w-full max-w-md space-y-10">
            <div className="lg:hidden text-center mb-8 flex flex-col items-center gap-4">
              <img src="/assets/founder.jpg" className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-lg object-cover" alt="Founder" />
              <h1 className="text-3xl font-black text-indigo-600 tracking-tighter uppercase">GenZ Academy</h1>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Enter your credentials to access your portal</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
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
                    placeholder="name@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" title="Recover Password" className="text-xs font-bold text-indigo-600 hover:text-purple-600 transition-colors">Forgot?</Link>
                </div>
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

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-black text-gray-400 tracking-widest"><span className="px-4 bg-gray-50/30">Or join with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    useOneTap
                    theme="outline"
                    shape="pill"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGithubLogin}
                  className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm transition-all font-bold text-sm text-gray-700"
                >
                  <Github className="w-4 h-4" /> GitHub
                </button>
              </div>
            </form>

            <p className="text-center text-sm font-medium text-slate-500">
              New to GenZ?{' '}
              <Link to="/register" className="text-indigo-600 font-black hover:text-purple-600 transition-colors pl-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
