import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Package, MapPin, Edit3, Trash2, Plus, CheckCircle, Clock, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrdersApi } from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile, addAddress, deleteAddress } = useAuth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Unspecified'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Unspecified'
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      fetchMyOrdersApi()
        .then((res) => setOrders(res.data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Profile Badge */}
      <div className="bg-white rounded-2xl border border-extrad-border p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name?.[0]?.toUpperCase() || 'E'}
          </div>
          <div>
            <h1 className="text-lg font-black text-extrad-dark">{user?.name}</h1>
            <p className="text-xs text-extrad-muted">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex gap-2 bg-extrad-light p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile' ? 'bg-white text-extrad-pink shadow-xs' : 'text-extrad-dark hover:text-extrad-pink'
            }`}
          >
            <User className="w-3.5 h-3.5" /> PROFILE DETAILS
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-white text-extrad-pink shadow-xs' : 'text-extrad-dark hover:text-extrad-pink'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> MY ORDERS ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'addresses' ? 'bg-white text-extrad-pink shadow-xs' : 'text-extrad-dark hover:text-extrad-pink'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> SAVED ADDRESSES
          </button>
        </div>
      </div>

      {/* TAB 1: EDIT PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-extrad-border p-6 max-w-xl space-y-4">
          <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider pb-2 border-b">
            EDIT ACCOUNT INFORMATION
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-extrad-dark uppercase block mb-1">FULL NAME</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full text-xs p-3 bg-extrad-light border rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-extrad-dark uppercase block mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full text-xs p-3 bg-extrad-light border rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-extrad-dark uppercase block mb-1">PHONE NUMBER</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full text-xs p-3 bg-extrad-light border rounded-lg focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 gradient-bg text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
            >
              SAVE CHANGES
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: ORDER HISTORY & LIVE TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider">ORDER HISTORY & STATUS</h3>
          {loadingOrders ? (
            <p className="text-xs text-extrad-muted">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-extrad-border p-8 text-center">
              <p className="text-xs text-extrad-muted">You have not placed any orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-extrad-border p-6 space-y-4 shadow-xs">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-black text-extrad-dark">ORDER ID: {order._id}</span>
                    <span className="text-xs text-gray-400 block">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded bg-extrad-peach text-extrad-pink">
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-black text-extrad-dark">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded bg-gray-100" />
                      <div className="flex-1">
                        <p className="font-bold text-extrad-dark">{item.brand}</p>
                        <p className="text-extrad-muted">{item.name}</p>
                      </div>
                      <span className="font-bold text-extrad-dark">₹{item.price} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-2xl border border-extrad-border p-6 space-y-4">
          <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider">SAVED ADDRESSES</h3>
          {user?.addresses?.map((addr) => (
            <div key={addr._id} className="p-4 rounded-xl border border-gray-200 flex justify-between items-start">
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-extrad-dark">{addr.name} ({addr.addressType})</span>
                <p className="text-extrad-muted">{addr.address}, {addr.locality}</p>
                <p className="text-extrad-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="font-semibold text-extrad-dark">Phone: {addr.phone}</p>
              </div>
              <button
                onClick={() => deleteAddress(addr._id)}
                className="text-gray-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
