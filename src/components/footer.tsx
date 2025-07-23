import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdConfirmationNumber,
} from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTicketAlt,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-10 left-1/4 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-white rounded-full"></div>
      </div>

      {/* Sparkle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <IoSparkles
          className="absolute top-16 left-1/4 text-yellow-300 animate-pulse"
          size={20}
        />
        <IoSparkles
          className="absolute top-32 right-1/3 text-pink-300 animate-pulse"
          size={16}
        />
        <IoSparkles
          className="absolute bottom-24 left-1/3 text-cyan-300 animate-pulse"
          size={18}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <FaTicketAlt size={24} />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Eventixs
              </h2>
            </div>
            <p className="text-purple-100 leading-relaxed">
              🎉 Your gateway to unforgettable experiences! Discover, book, and
              enjoy the hottest events in town.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              >
                <FaFacebook size={18} className="group-hover:animate-bounce" />
              </a>
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <FaTwitter size={18} className="group-hover:animate-bounce" />
              </a>
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              >
                <FaInstagram size={18} className="group-hover:animate-bounce" />
              </a>
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <FaLinkedin size={18} className="group-hover:animate-bounce" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full mr-3"></span>
              Quick Access
            </h3>
            <ul className="space-y-3">
              {[
                "🎪 Browse Events",
                "🎫 Buy Tickets",
                "📅 My Bookings",
                "🌟 VIP Access",
                "🎁 Gift Cards",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center hover:text-pink-300 transition-all duration-200 hover:translate-x-2"
                  >
                    <span className="group-hover:animate-pulse">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-3"></span>
              Hot Categories
            </h3>
            <ul className="space-y-3">
              {[
                "🎵 Concerts & Music",
                "🎤 Comedy Shows",
                "🎭 Theater & Arts",
                "⚽ Sports Events",
                "🍷 Food & Wine",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center hover:text-cyan-300 transition-all duration-200 hover:translate-x-2"
                  >
                    <span className="group-hover:animate-pulse">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-3"></span>
              Stay Connected
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                  <MdLocationOn size={16} />
                </div>
                <span className="text-sm text-purple-100">
                  123 Event Street, Nairobi
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                  <MdPhone size={16} />
                </div>
                <span className="text-sm text-purple-100">
                  +254 700 123 456
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                  <MdEmail size={16} />
                </div>
                <span className="text-sm text-purple-100">
                  tickets@eventixs.com
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-300/20">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                🎉 Never Miss Out!
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email for hot events"
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 text-sm rounded-l-xl border border-purple-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm rounded-r-xl transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center">
                  <MdConfirmationNumber size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-purple-300/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-purple-200 flex items-center space-x-2">
              <FaTicketAlt className="text-pink-400" size={14} />
              <span>
                &copy; {new Date().getFullYear()} Eventixs. Making memories, one
                ticket at a time.
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Refund Policy",
                "24/7 Support",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-purple-200 hover:text-pink-300 transition-colors duration-200 hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
