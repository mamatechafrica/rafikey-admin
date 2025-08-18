import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Moon,
  Sun,
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  isSidebarCollapsed, 
  toggleTheme, 
  toggleSidebar 
}) => {
  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-10 ${
      isDarkMode 
        ? 'bg-gray-800/90 border-gray-700/50' 
        : 'bg-white/80 border-black/10'
    }`}>
      <div className="flex items-center justify-between px-4 py-2 sm:px-8 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl transition-all hover:scale-110 lg:hidden ${
              isDarkMode
                ? "bg-gray-700/50 hover:bg-gray-600/50 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1
            className={`text-lg sm:text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search bar hidden on mobile */}
          <div className="relative hidden md:block">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search Metrics..."
              className={`pl-10 pr-4 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all hover:scale-110 ${
              isDarkMode
                ? "bg-gray-700/50 hover:bg-gray-600/50 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            className={`relative p-2 rounded-xl transition-all hover:scale-110 ${
              isDarkMode
                ? "bg-gray-700/50 hover:bg-gray-600/50 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* User info hidden on mobile, show only avatar */}
          <div
            className={`flex items-center px-2 py-1 rounded-xl ${
              isDarkMode
                ? "bg-gray-700/50 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:flex flex-col ml-2">
              <div className="text-sm font-medium">Alex Kimani</div>
              <div
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Admin
              </div>
            </div>
            <ChevronDown className="w-4 h-4 hidden sm:inline ml-2" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;