import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <main className="p-8">
          {children}
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default Layout;
