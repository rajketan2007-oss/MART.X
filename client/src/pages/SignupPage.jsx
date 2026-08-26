import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    const res = await register(formData);
    if (res.success) {
      navigate('/');
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
            CREATE AN EXTRAD ACCOUNT
          </h1>
          <p className="text-xs text-extrad-muted">
            Unlock flat ₹300 OFF, saved address book & easy order tracking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              MOBILE NUMBER
            </label>
            <input
              type="text"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-extrad-dark uppercase tracking-wider block mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full text-xs p-3 bg-extrad-light border border-transparent rounded-lg focus:border-extrad-pink focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER & GET ₹300 OFF'}
          </button>
        </form>

        <div className="text-center text-xs text-extrad-muted">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-extrad-pink hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
