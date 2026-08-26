import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { fetchCouponsApi, createCouponApi, deleteCouponApi } from '../../services/api';
import { useUI } from '../../context/UIContext';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useUI();

  const [form, setForm] = useState({
    code: '',
    discountType: 'flat',
    discountValue: 200,
    minOrderValue: 999,
    description: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setLoading(true);
    fetchCouponsApi()
      .then((res) => setCoupons(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCouponApi(form);
      addToast('Coupon created successfully!', 'success');
      setShowModal(false);
      loadCoupons();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon code?')) {
      try {
        await deleteCouponApi(id);
        addToast('Coupon deleted', 'info');
        loadCoupons();
      } catch (err) {
        addToast('Failed to delete coupon', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-extrad-border">
        <div>
          <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">COUPON MANAGEMENT</h1>
          <p className="text-xs text-extrad-muted">Create promo discount codes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="gradient-bg text-white text-xs font-extrabold px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> CREATE NEW COUPON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white p-5 rounded-2xl border border-extrad-border shadow-xs relative space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-extrad-dark tracking-widest uppercase">{c.code}</span>
              <button onClick={() => handleDelete(c._id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-extrad-pink">
              {c.discountType === 'flat' ? `Flat ₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
            </p>
            <p className="text-xs text-extrad-muted">Min order: ₹{c.minOrderValue}</p>
            <p className="text-[11px] text-gray-400">{c.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-black text-extrad-dark uppercase">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">PROMO CODE</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="w-full p-2.5 bg-gray-50 border rounded-lg uppercase font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">DISCOUNT VALUE (₹ or %)</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
                <div>
                  <label className="font-bold block mb-1">MIN ORDER (₹)</label>
                  <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">DESCRIPTION</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-bg text-white font-extrabold uppercase rounded-xl">Create Coupon</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-3 border font-extrabold uppercase rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
