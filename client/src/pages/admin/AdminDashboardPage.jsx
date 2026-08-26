import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Shield } from 'lucide-react';
import { fetchAdminStatsApi } from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStatsApi()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-extrad-muted">Loading Admin Analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-purple-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-black uppercase tracking-wider">EXTRAD ADMIN CONTROL PORTAL</h1>
          </div>
          <p className="text-xs text-purple-200">Manage catalog, process customer orders & inspect real-time metrics</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg">Products</Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg">Orders</Link>
          <Link to="/admin/users" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg">Users</Link>
          <Link to="/admin/coupons" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg">Coupons</Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-extrad-border shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-extrad-muted uppercase tracking-wider block">TOTAL REVENUE</span>
          <span className="text-2xl font-black text-extrad-dark">₹{stats?.totalRevenue || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-extrad-border shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-extrad-muted uppercase tracking-wider block">TOTAL ORDERS</span>
          <span className="text-2xl font-black text-extrad-dark">{stats?.totalOrders || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-extrad-border shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-extrad-muted uppercase tracking-wider block">TOTAL PRODUCTS</span>
          <span className="text-2xl font-black text-extrad-dark">{stats?.totalProducts || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-extrad-border shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-extrad-muted uppercase tracking-wider block">REGISTERED USERS</span>
          <span className="text-2xl font-black text-extrad-dark">{stats?.totalUsers || 0}</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-extrad-border p-6 space-y-4">
        <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider">RECENT CUSTOMER ORDERS</h3>
        <div className="divide-y divide-gray-100">
          {stats?.recentOrders?.map((ord) => (
            <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-extrad-dark">{ord._id}</span>
                <span className="text-extrad-muted block">{ord.user?.name} ({ord.user?.email})</span>
              </div>
              <div className="text-right">
                <span className="font-black text-extrad-dark">₹{ord.totalAmount}</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded block mt-0.5">
                  {ord.orderStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
