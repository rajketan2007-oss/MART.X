import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { fetchProductsApi, createProductApi, updateProductApi, deleteProductApi, fetchCategoriesApi } from '../../services/api';
import { useUI } from '../../context/UIContext';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { addToast } = useUI();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    categoryId: '',
    description: '',
    price: '',
    mrp: '',
    images: '',
    sizes: 'S, M, L, XL',
    colors: 'Black, White',
    stock: 15,
    gender: 'Unisex'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchProductsApi({ pageSize: 50 }), fetchCategoriesApi()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.products || []);
        setCategories(cRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      brand: '',
      categoryId: categories[0]?._id || '',
      description: '',
      price: '',
      mrp: '',
      images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      sizes: 'S, M, L, XL',
      colors: 'Black, White',
      stock: 15,
      gender: 'Unisex'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      brand: p.brand,
      categoryId: p.category?._id || categories[0]?._id || '',
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      images: Array.isArray(p.images) ? p.images.join(', ') : p.images,
      sizes: p.sizes ? p.sizes.join(', ') : 'S, M, L',
      colors: p.colors ? p.colors.join(', ') : 'Black',
      stock: p.stock,
      gender: p.gender || 'Unisex'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id);
        addToast('Product deleted!', 'info');
        loadData();
      } catch (err) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      images: form.images.split(',').map((s) => s.trim()),
      sizes: form.sizes.split(',').map((s) => s.trim()),
      colors: form.colors.split(',').map((s) => s.trim())
    };

    try {
      if (editingId) {
        await updateProductApi(editingId, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await createProductApi(payload);
        addToast('New product created successfully!', 'success');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-extrad-border">
        <div>
          <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">PRODUCT MANAGEMENT</h1>
          <p className="text-xs text-extrad-muted">Total Catalog Items: {products.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="gradient-bg text-white text-xs font-extrabold px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-extrad-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-extrad-border text-extrad-muted font-bold uppercase">
            <tr>
              <th className="p-3.5">Product</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Price / MRP</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50/50">
                <td className="p-3.5 flex items-center gap-3">
                  <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded bg-gray-100" />
                  <div>
                    <span className="font-extrabold text-extrad-dark uppercase block">{p.brand}</span>
                    <span className="text-extrad-muted">{p.name}</span>
                  </div>
                </td>
                <td className="p-3.5 text-extrad-dark font-semibold">{p.categoryName}</td>
                <td className="p-3.5">
                  <span className="font-bold text-extrad-dark">₹{p.price}</span>{' '}
                  <span className="text-gray-400 line-through text-[11px]">₹{p.mrp}</span>
                </td>
                <td className="p-3.5 font-bold text-emerald-700">{p.stock} units</td>
                <td className="p-3.5 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-sm font-black uppercase text-extrad-dark">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">BRAND NAME</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
                <div>
                  <label className="font-bold block mb-1">PRODUCT TITLE</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold block mb-1">CATEGORY</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg">
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">GENDER</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg font-medium">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">SELLING PRICE (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
                <div>
                  <label className="font-bold block mb-1">ORIGINAL MRP (₹)</label>
                  <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">IMAGE URLS (Comma Separated)</label>
                <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
              </div>

              <div>
                <label className="font-bold block mb-1">DESCRIPTION</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full p-2.5 bg-gray-50 border rounded-lg" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-bg text-white font-extrabold uppercase rounded-xl">SAVE PRODUCT</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border font-extrabold uppercase rounded-xl">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
