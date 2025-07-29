import { Link } from "react-router";
import { FaTicketAlt, FaSearch, FaUser, FaTimes, FaBars } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      data-testid="navbar"
      className=" bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl sticky top-0 z-50 backdrop-blur-md border-b border-purple-300/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 left-20 w-8 h-8 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-32 w-6 h-6 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-1 right-64 w-4 h-4 border border-white rounded-full animate-pulse"></div>
      </div>

      {/* Sparkle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <IoSparkles
          className="absolute top-6 left-1/4 text-pink-300 animate-pulse"
          size={12}
        />
        <IoSparkles
          className="absolute top-4 right-1/3 text-cyan-300 animate-pulse"
          size={10}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg animate-pulse">
              <FaTicketAlt size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <Link
              to="/"
              data-testid="brand-logo"
              className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 tracking-wide hover:from-cyan-400 hover:via-pink-400 hover:to-purple-400 transition-all duration-500 hover:scale-105"
            >
              Eventixs
            </Link>
          </div>

          {/* Desktop Search Bar - Hidden on medium and small screens */}
          <div className="hidden xl:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaSearch
                  className="absolute left-4 text-white/60 z-10"
                  size={16}
                />
                <input
                  type="text"
                  data-testid="desktop-search-input"
                  placeholder="Search events, venues, artists..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-2xl border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                />
                <button 
                  data-testid="desktop-search-button"
                  className="absolute right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:scale-110 transition-transform duration-200"
                >
                  <FaSearch size={12} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on small screens */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8 font-semibold text-white/90">
            <Link
              to="/home"
              data-testid="nav-home-desktop"
              className="relative px-3 xl:px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
            >
              <span className="flex items-center space-x-1">
                <span>🏠</span>
                <span>Home</span>
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              to="/events"
              data-testid="nav-events-desktop"
              className="relative px-3 xl:px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
            >
              <span className="flex items-center space-x-1">
                <span>🎉</span>
                <span>Events</span>
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              to="/about"
              data-testid="nav-about-desktop"
              className="relative px-3 xl:px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
            >
              <span className="flex items-center space-x-1">
                <span>ℹ</span>
                <span>About</span>
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              to="/admin/dashboard/events"
              data-testid="nav-dashboard-desktop"
              className="relative px-3 xl:px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
            >
              <span className="flex items-center space-x-1">
                <span>📊</span>
                <span>Dashboard</span>
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications - Hidden on very small screens */}
            <button 
              data-testid="notifications-button"
              className="hidden sm:block relative p-2 sm:p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-purple-300/30 hover:scale-110 transition-all duration-300 group"
            >
              <MdNotifications
                size={16}
                className="text-white/80 group-hover:text-white sm:w-4 sm:h-4"
              />
              <span 
                data-testid="notifications-badge"
                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse"
              >
                3
              </span>
            </button>

            {/* Desktop Auth Buttons - Hidden on small screens */}
            <div className="hidden md:flex space-x-2 lg:space-x-3">
              <Link to="/login">
                <button 
                  data-testid="login-button-desktop"
                  className="group relative px-4 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm font-semibold rounded-xl lg:rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm text-white/90 hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative flex items-center space-x-1 lg:space-x-2">
                    <FaUser size={10} className="lg:w-3 lg:h-3" />
                    <span>Login</span>
                  </span>
                </button>
              </Link>

              <Link to="/register">
                <button 
                  data-testid="register-button-desktop"
                  className="group relative px-4 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm font-semibold rounded-xl lg:rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative flex items-center space-x-1 lg:space-x-2">
                    <FaTicketAlt size={10} className="lg:w-3 lg:h-3" />
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Join</span>
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              data-testid="mobile-menu-toggle"
              className="lg:hidden p-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg border border-purple-300/30 hover:scale-110 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <FaTimes size={18} className="text-white" />
              ) : (
                <FaBars size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Shows on medium and small screens */}
        <div className="xl:hidden px-0 pb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <FaSearch
                className="absolute left-3 sm:left-4 text-white/60 z-10"
                size={14}
              />
              <input
                type="text"
                data-testid="mobile-search-input"
                placeholder="🔍 Search events..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-xl sm:rounded-2xl border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          data-testid="mobile-menu-overlay"
          onClick={closeMobileMenu}
        >
          <div 
            data-testid="mobile-menu"
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 shadow-2xl border-l border-purple-300/20"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-300/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg">
                  <FaTicketAlt size={18} className="text-white" />
                </div>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
                  Eventixs
                </span>
              </div>
              <button
                onClick={closeMobileMenu}
                data-testid="mobile-menu-close"
                className="p-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg border border-purple-300/30 hover:scale-110 transition-all duration-300"
              >
                <FaTimes size={16} className="text-white" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <Link
                  to="/home"
                  data-testid="nav-home-mobile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <span>🏠</span>
                  <span className="font-semibold">Home</span>
                </Link>

                <Link
                  to="/events"
                  data-testid="nav-events-mobile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <span>🎉</span>
                  <span className="font-semibold">Events</span>
                </Link>

                <Link
                  to="/about"
                  data-testid="nav-about-mobile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <span>ℹ</span>
                  <span className="font-semibold">About</span>
                </Link>

                <Link
                  to="/admin/dashboard/events"
                  data-testid="nav-dashboard-mobile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <span>📊</span>
                  <span className="font-semibold">Dashboard</span>
                </Link>
              </div>

              {/* Mobile Notifications */}
              <div className="border-t border-purple-300/20 pt-6">
                <button 
                  data-testid="notifications-mobile"
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 text-white/90 hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <MdNotifications size={20} />
                    <span className="font-semibold">Notifications</span>
                  </div>
                  <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                    3
                  </span>
                </button>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-purple-300/20 pt-6 space-y-3">
                <Link to="/login" onClick={closeMobileMenu}>
                  <button 
                    data-testid="login-button-mobile"
                    className="w-full group relative p-4 text-sm font-semibold rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm text-white/90 hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center space-x-2">
                      <FaUser size={14} />
                      <span>Login to Account</span>
                    </span>
                  </button>
                </Link>

                <Link to="/register" onClick={closeMobileMenu}>
                  <button 
                    data-testid="register-button-mobile"
                    className="w-full group relative p-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center space-x-2">
                      <FaTicketAlt size={14} />
                      <span>Get Started</span>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;