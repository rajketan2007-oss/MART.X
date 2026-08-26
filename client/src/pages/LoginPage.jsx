import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Sparkles, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await login(email, password);
    if (res.success) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = await login(demoEmail, demoPass);
    if (res.success) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-extrad-border p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl gradient-bg text-white font-black text-2xl italic flex items-center justify-center mx-auto shadow-md">
            E
          </div>
          <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">
            LOGIN TO EXTRAD
          </h1>
          <p className="text-xs text-extrad-muted">
            Access your orders, wishlist, saved addresses and exclusive coupons
          </p>
        </div>

        {/* Instant Demo Account Login Helpers */}
        <div className="bg-extrad-peach/50 p-3.5 rounded-xl border border-extrad-peach space-y-2">
          <span className="text-[10px] font-extrabold text-extrad-pink uppercase tracking-widest block text-center">
            QUICK DEMO ONE-CLICK LOGIN
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user@extrad.com', 'user123')}
              className="flex-1 py-2 bg-white text-extrad-dark border border-gray-200 rounded-lg text-[11px] font-bold hover:border-extrad-pink transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Demo Shopper
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@extrad.com', 'admin123')}
              className="flex-1 py-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN TO ACCOUNT'}
          </button>
        </form>

        <div className="text-center text-xs text-extrad-muted">
          New to Extrad?{' '}
          <Link to="/signup" className="font-bold text-extrad-pink hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
