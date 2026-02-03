import React, { useState } from 'react';
import { Home, History, FolderOpen, Settings, Zap, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'history', icon: <History size={20} />, label: 'History' },
    { id: 'assets', icon: <FolderOpen size={20} />, label: 'Assets' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-red font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary-red rounded flex items-center justify-center text-white">
            <Zap size={20} fill="currentColor" />
          </div>
          AI STUDIO
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-dark p-4 rounded-xl border border-white/5 mb-4">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Credits</p>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">1,250</span>
            <button className="text-[10px] bg-primary-red/10 text-primary-red px-2 py-1 rounded-full hover:bg-primary-red hover:text-white transition-colors">
              UPGRADE
            </button>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-primary-red text-white rounded-full shadow-2xl shadow-primary-red/40"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-dark-gray border-r border-white/5 flex-col h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="relative w-64 bg-dark-gray h-full flex flex-col shadow-2xl border-r border-white/10 animate-slide-right">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
