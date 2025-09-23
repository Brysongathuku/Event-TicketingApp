import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTicketAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <FaTicketAlt size={20} />
              </div>
              <h2 className="text-2xl font-bold">Eventixs</h2>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Your gateway to unforgettable experiences! Discover and book the
              hottest events.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:scale-110 transition-transform"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="#"
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg hover:scale-110 transition-transform"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg hover:scale-110 transition-transform"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:scale-110 transition-transform"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Browse Events", "Buy Tickets", "My Bookings", "Support"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-purple-100 hover:text-pink-300 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MdLocationOn size={16} className="text-pink-400" />
                <span className="text-purple-100">94946 ,coventry</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdPhone size={16} className="text-pink-400" />
                <span className="text-purple-100">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdEmail size={16} className="text-pink-400" />
                <span className="text-purple-100">tickets@eventixs.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-300/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <div className="text-purple-200 flex items-center space-x-2">
              <FaTicketAlt className="text-pink-400" size={12} />
              <span>
                &copy; {new Date().getFullYear()} Eventixs. All rights reserved.
              </span>
            </div>

            <div className="flex space-x-4 mt-2 md:mt-0">
              <a
                href="#"
                className="text-purple-200 hover:text-pink-300 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-purple-200 hover:text-pink-300 transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
