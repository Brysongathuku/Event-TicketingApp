import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 tracking-wide hover:from-purple-400 hover:to-indigo-600 transition-all duration-300"
          >
            Eventixs
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex space-x-10 font-semibold text-gray-300">
          <Link
            to="/home"
            className="relative px-4 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-300 group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="relative px-4 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-300 group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/admin/dashboard/events"
            className="relative px-4 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-300 group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="px-6 py-3 text-sm font-medium rounded-full border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
