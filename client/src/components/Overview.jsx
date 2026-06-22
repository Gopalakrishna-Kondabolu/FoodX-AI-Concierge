import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MessageCircle, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/conversations/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-food-600">Loading overview...</div>;
  if (!stats) return <div className="text-red-500">Failed to load statistics.</div>;

  const chartData = stats.intentCounts.map(item => ({
    name: item._id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: item.count
  }));

  const autoResolvedRate = (100 - stats.escalationRate).toFixed(1);

  const colors = {
    'Menu Query': '#f59e0b',
    'Order Status': '#3b82f6',
    'Recommendation': '#10b981',
    'Escalated': '#ef4444',
    'Other': '#6b7280'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Conversations" 
          value={stats.totalConversations} 
          icon={<MessageCircle className="text-blue-500" />} 
          trend="+12% today"
        />
        <StatCard 
          title="Auto-Resolved %" 
          value={`${autoResolvedRate}%`} 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          trend="Target: 80%"
        />
        <StatCard 
          title="Escalation Rate" 
          value={`${stats.escalationRate}%`} 
          icon={<AlertTriangle className="text-red-500" />} 
          trend="Requires human"
        />
        <StatCard 
          title="Avg Response Time" 
          value={`${stats.averageResponseTimeMs}ms`} 
          icon={<Clock className="text-amber-500" />} 
          trend="Lightning fast"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-food-100 mt-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Conversations by Intent</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.name] || '#e11d48'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-food-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="text-slate-500 font-medium text-sm">{title}</div>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
        <div className="text-xs text-slate-400 font-medium">{trend}</div>
      </div>
    </div>
  );
}
