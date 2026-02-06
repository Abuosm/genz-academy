import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FileText,
  Building2,
  Briefcase,
  Bookmark,
  AlertCircle,
  MessageCircle,
  User,
  Search,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = React.useContext(AuthContext);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: CheckSquare, label: 'Tests', path: '/tests' },
    { icon: FileText, label: 'Assignments', path: '/assignments' },
    { icon: Building2, label: 'Company Questions', path: '/company-questions' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  ];

  const bottomItems = [
    { icon: AlertCircle, label: 'Report an issue', path: '/report-issue' },
    { icon: MessageCircle, label: 'Ask GenZ', path: '/ask-genz' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Floating Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-blue-600 hover:bg-gray-50 transition-all active:scale-95"
          title="Open Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar Container */}
      <div className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">GenZ Academy</h1>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 group"
            title="Close Sidebar"
          >
            <ChevronLeft className="h-5 w-5 group-hover:text-gray-600" />
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-gray-100 space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Backdrop for mobile or focus (optional, but good for UX) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
