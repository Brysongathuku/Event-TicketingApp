import { Link } from "react-router";
import { FaTicketAlt, FaSearch, FaUser } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl sticky top-0 z-50 backdrop-blur-md border-b border-purple-300/20">
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

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
            <FaTicketAlt size={20} className="text-white" />
          </div>
          <Link
            to="/"
            className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 tracking-wide hover:from-cyan-400 hover:via-pink-400 hover:to-purple-400 transition-all duration-500 hover:scale-105"
          >
            Eventixs
          </Link>
        </div>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <FaSearch
                className="absolute left-4 text-purple-300 z-10"
                size={16}
              />
              <input
                type="text"
                placeholder="🎫 Search events, venues, artists..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 rounded-2xl border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
              />
              <button className="absolute right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:scale-110 transition-transform duration-200">
                <FaSearch size={12} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex space-x-8 font-semibold text-purple-100">
          <Link
            to="/home"
            className="relative px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
          >
            <span className="flex items-center space-x-1">
              <span>🏠</span>
              <span>Home</span>
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/events"
            className="relative px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
          >
            <span className="flex items-center space-x-1">
              <span>🎪</span>
              <span>Events</span>
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/about"
            className="relative px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
          >
            <span className="flex items-center space-x-1">
              <span>ℹ️</span>
              <span>About</span>
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/admin/dashboard/events"
            className="relative px-4 py-2 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 transition-all duration-300 group"
          >
            <span className="flex items-center space-x-1">
              <span>📊</span>
              <span>Dashboard</span>
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl border border-purple-300/30 hover:scale-110 transition-all duration-300 group">
            <MdNotifications
              size={18}
              className="text-purple-200 group-hover:text-white"
            />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
              3
            </span>
          </button>

          {/* Auth Buttons */}
          <div className="flex space-x-3">
            <Link to="/login">
              <button className="group relative px-6 py-3 text-sm font-semibold rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm text-purple-100 hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-2">
                  <FaUser size={12} />
                  <span>Login</span>
                </span>
              </button>
            </Link>

            <Link to="/register">
              <button className="group relative px-6 py-3 text-sm font-semibold rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative flex items-center space-x-2">
                  <FaTicketAlt size={12} />
                  <span>Get Started</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search - Shows on small screens */}
      <div className="lg:hidden px-6 pb-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <FaSearch
              className="absolute left-4 text-purple-300 z-10"
              size={14}
            />
            <input
              type="text"
              placeholder="🔍 Search events..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 rounded-2xl border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
