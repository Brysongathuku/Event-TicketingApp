import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Eventixs</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your premier destination for discovering and booking amazing
                events. From concerts to conferences, we make event planning
                effortless.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-colors duration-300"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-colors duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-colors duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 transition-colors duration-300"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Browse Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Create Event
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  My Bookings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Event Calendar
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Event Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Concerts & Music
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Conferences
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Festivals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Sports Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Workshops
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MdLocationOn size={16} className="text-indigo-400" />
                <span className="text-sm">
                  123 Event Street, Nairobi, Kenya
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MdPhone size={16} className="text-indigo-400" />
                <span className="text-sm">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <MdEmail size={16} className="text-indigo-400" />
                <span className="text-sm">hello@eventixs.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-2">
                Stay Updated
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-r-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Eventixs. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
