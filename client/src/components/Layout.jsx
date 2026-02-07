import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background text-gray-100 flex overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-background z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/assets/grid.svg')] opacity-[0.03]"></div>
      </div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 relative z-10 ${isSidebarOpen ? 'md:pl-72' : 'pl-0'}`}>
        <header className="h-16 md:hidden flex items-center px-4 border-b border-glass-border bg-glass-surface backdrop-blur-md sticky top-0 z-40">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-black uppercase tracking-widest text-sm text-white">GenZ Academy</span>
        </header>

        <main className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
          {children}
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default Layout;
