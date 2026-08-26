import React, { useState, useEffect } from 'react';
import { Trash2, UserX } from 'lucide-react';
import { fetchAdminUsersApi, deleteAdminUserApi } from '../../services/api';
import { useUI } from '../../context/UIContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUI();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    fetchAdminUsersApi()
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to block/remove this user account?')) {
      try {
        await deleteAdminUserApi(id);
        addToast('User removed', 'info');
        loadUsers();
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to remove user', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">USER MANAGEMENT</h1>
        <p className="text-xs text-extrad-muted">Registered shoppers and administrators</p>
      </div>

      <div className="bg-white rounded-2xl border border-extrad-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-extrad-border text-extrad-muted font-bold uppercase">
            <tr>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50">
                <td className="p-3.5 font-bold text-extrad-dark">{u.name}</td>
                <td className="p-3.5 text-extrad-muted">{u.email}</td>
                <td className="p-3.5">{u.phone || 'N/A'}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
