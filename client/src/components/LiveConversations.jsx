import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function LiveConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = () => {
    fetch(`${API_BASE_URL}/api/conversations`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching conversations:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPhone = (phone) => {
    if (!phone) return 'Unknown';
    // Match something like +919876543210 and format as +91 9XXXX-XX210
    const match = phone.match(/^(\+\d{2})(\d{1})(\d{4})(\d{2})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]}XXXX-XX${match[5]}`;
    }
    return phone; // Fallback
  };

  const getIntentBadge = (intent) => {
    const badges = {
      menu_query: 'bg-amber-100 text-amber-800 border-amber-200',
      order_status: 'bg-blue-100 text-blue-800 border-blue-200',
      recommendation: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      escalated: 'bg-red-100 text-red-800 border-red-200',
      other: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    const style = badges[intent] || badges.other;
    const label = intent.replace('_', ' ').toUpperCase();
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style}`}>
        {label}
      </span>
    );
  };

  if (loading && conversations.length === 0) return <div className="text-food-600">Loading conversations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Live Conversations</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <RefreshCw size={14} className="animate-spin-slow text-food-600" />
          <span>Auto-updating (5s)</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-food-100 overflow-hidden">
        <div className="divide-y divide-food-100 max-h-[70vh] overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv._id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 text-white font-mono text-sm px-3 py-1 rounded-md">
                    {formatPhone(conv.customerPhone)}
                  </div>
                  {getIntentBadge(conv.intent)}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-600 font-bold text-xs">CU</div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-slate-700 text-sm w-fit max-w-[80%]">
                    {conv.customerMessage}
                  </div>
                </div>
                <div className="flex gap-4 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-food-600 flex items-center justify-center shrink-0 text-white font-bold text-xs">AI</div>
                  <div className="bg-food-50 border border-food-100 rounded-2xl rounded-tr-none px-4 py-3 text-food-900 text-sm w-fit max-w-[80%]">
                    {conv.botReply}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-8 text-center text-slate-500">No conversations logged yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
