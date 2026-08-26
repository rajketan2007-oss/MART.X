import React, { useState, useEffect } from 'react';
import { fetchAllOrdersAdminApi, updateOrderStatusAdminApi } from '../../services/api';
import { useUI } from '../../context/UIContext';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUI();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    fetchAllOrdersAdminApi()
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAdminApi(orderId, newStatus);
      addToast(`Order status updated to ${newStatus}!`, 'success');
      loadOrders();
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">ORDER MANAGEMENT</h1>
        <p className="text-xs text-extrad-muted">Update order fulfillment & delivery statuses</p>
      </div>

      <div className="bg-white rounded-2xl border border-extrad-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-extrad-border text-extrad-muted font-bold uppercase">
            <tr>
              <th className="p-3.5">Order ID / Date</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Items</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {orders.map((ord) => (
              <tr key={ord._id} className="hover:bg-gray-50/50">
                <td className="p-3.5">
                  <span className="font-extrabold text-extrad-dark block">{ord._id}</span>
                  <span className="text-gray-400 text-[10px]">{new Date(ord.createdAt).toLocaleString()}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-bold text-extrad-dark block">{ord.user?.name || 'Customer'}</span>
                  <span className="text-extrad-muted text-[11px]">{ord.user?.email}</span>
                </td>
                <td className="p-3.5">
                  {ord.orderItems?.length} items ({ord.orderItems?.[0]?.name})
                </td>
                <td className="p-3.5 font-bold text-extrad-dark">₹{ord.totalAmount}</td>
                <td className="p-3.5">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    className="text-xs font-bold p-2 bg-extrad-light rounded-lg border border-gray-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
