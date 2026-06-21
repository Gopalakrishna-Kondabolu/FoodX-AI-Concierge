import React, { useState } from 'react';
import Overview from './components/Overview';
import LiveConversations from './components/LiveConversations';
import MenuManagement from './components/MenuManagement';
import Orders from './components/Orders';
import { ChefHat, LayoutDashboard, MessageSquare, UtensilsCrossed, Receipt } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'conversations', label: 'Live Conversations', icon: MessageSquare },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: Receipt },
  ];

  return (
    <div className="flex h-screen bg-food-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-food-100 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-food-100">
          <div className="bg-food-600 text-white p-2 rounded-lg">
            <ChefHat size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">FoodX AI</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-food-600 text-white shadow-md shadow-food-500/20' 
                    : 'text-slate-600 hover:bg-food-50 hover:text-food-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'conversations' && <LiveConversations />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'orders' && <Orders />}
        </div>
      </main>
    </div>
  );
}

export default App;
