import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function Orders() {
  // Fetch a subset of orders based on the seeded demo customer phone, or just fetch all
  // For the demo, let's just fetch orders for our main demo number to show the UI
  // Wait, the API only has /api/orders/:id and /api/orders/customer/:phone
  // Let's use the demo phone number +919876543210
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const demoPhone = '+919573633429';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/orders/customer/${encodeURIComponent(demoPhone)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      placed: 'bg-slate-100 text-slate-800 border-slate-200',
      preparing: 'bg-amber-100 text-amber-800 border-amber-200',
      out_for_delivery: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    const style = badges[status] || badges.placed;
    const label = status.replace(/_/g, ' ').toUpperCase();
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style}`}>
        {label}
      </span>
    );
  };

  if (loading) return <div className="text-food-600">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Recent Orders</h2>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Showing Demo Customer: {demoPhone}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.orderId} className="bg-white rounded-2xl shadow-sm border border-food-100 overflow-hidden">
            <div className="bg-slate-50 border-b border-food-100 p-4 px-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800">{order.orderId}</span>
                <span className="text-sm text-slate-500">
                  {new Date(order.placedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Customer</div>
                  <div className="font-medium text-slate-800">{order.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">Estimated Delivery</div>
                  <div className="font-medium text-slate-800">
                    {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Item</th>
                      <th className="px-4 py-2 font-medium text-center">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">Price</th>
                      <th className="px-4 py-2 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-slate-600">₹{item.price}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800">₹{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-bold text-slate-700">Total Amount</td>
                      <td className="px-4 py-3 text-right font-bold text-food-600 text-lg">₹{order.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-500 shadow-sm border border-food-100">
            No orders found for this customer.
          </div>
        )}
      </div>
    </div>
  );
}
