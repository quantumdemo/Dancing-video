import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
