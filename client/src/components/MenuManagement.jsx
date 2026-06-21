import React, { useState, useEffect } from 'react';
import { Leaf, Drumstick } from 'lucide-react';

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setLoading(false);
      });
  }, []);

  const toggleAvailability = (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setMenu(prev => prev.map(item => 
      item.id === id ? { ...item, available: newStatus } : item
    ));

    fetch(`http://localhost:5000/api/menu/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: newStatus })
    }).catch(err => {
      console.error('Error updating availability:', err);
      // Revert on error
      setMenu(prev => prev.map(item => 
        item.id === id ? { ...item, available: currentStatus } : item
      ));
    });
  };

  if (loading) return <div className="text-food-600">Loading menu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Menu Management</h2>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Total Items: {menu.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-food-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-food-100 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Type</th>
                <th className="p-4 pr-6 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-food-50 text-sm">
              {menu.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-800">
                    <div>{item.name}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">₹{item.price}</td>
                  <td className="p-4">
                    {item.isVeg ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md border border-emerald-100">
                        <Leaf size={14} /> <span className="text-xs font-bold">VEG</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-600 bg-red-50 w-fit px-2 py-1 rounded-md border border-red-100">
                        <Drumstick size={14} /> <span className="text-xs font-bold">NON-VEG</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => toggleAvailability(item.id, item.available)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-food-500 focus:ring-offset-2 ${
                        item.available ? 'bg-food-600' : 'bg-slate-300'
                      }`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.available ? 'translate-x-6' : 'translate-x-1'
                        }`} 
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
