import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FaTicketAlt,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { MdEvent } from "react-icons/md";

// Working online images for testing - replace with your local paths once working
const images = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&q=80",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageExists, setImageExists] = useState(true);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", images[currentIndex]);
    setIsImageLoaded(true);
    setImageExists(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", (e.target as HTMLImageElement).src);
    console.log("Current image index:", currentIndex);
    setImageExists(false);
    setIsImageLoaded(false);
  };

  // Reset image loaded state when index changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={images[currentIndex]}
          alt={`Event ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-1000 transform ${
            isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Fallback background - always visible if no image */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 transition-opacity duration-700 ${
            isImageLoaded && imageExists ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Animated background pattern for fallback */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Vibrant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-indigo-900/60 z-10" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        <IoSparkles
          className="absolute top-32 left-1/4 text-pink-300 animate-bounce"
          size={24}
        />
        <IoSparkles
          className="absolute top-48 right-1/3 text-cyan-300 animate-pulse"
          size={20}
        />
        <IoSparkles
          className="absolute bottom-48 left-1/3 text-yellow-300 animate-bounce"
          size={22}
        />
        <IoSparkles
          className="absolute bottom-32 right-1/4 text-pink-400 animate-pulse"
          size={18}
        />

        {/* Floating tickets */}
        <div className="absolute top-24 right-20 text-white/20 animate-float">
          <FaTicketAlt size={32} className="transform rotate-12" />
        </div>
        <div className="absolute bottom-24 left-16 text-white/20 animate-float-delayed">
          <FaTicketAlt size={28} className="transform -rotate-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="p-6 bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
            <MdEvent size={48} className="text-white animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2">
            <IoSparkles className="text-yellow-300 animate-spin" size={16} />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in">
          🎉 Welcome to Eventixs
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl max-w-3xl mb-8 text-purple-100 drop-shadow-lg font-medium leading-relaxed animate-slide-up">
          Your gateway to unforgettable experiences! 🎪 Discover amazing events,
          🎵 book tickets instantly, and 🌟 create memories that last forever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up-delayed">
          <Link to="/register">
            <button className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative flex items-center space-x-2">
                <FaTicketAlt />
                <span>🎫 Get Your Tickets Now</span>
              </span>
            </button>
          </Link>

          <Link to="/events">
            <button className="group px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="flex items-center space-x-2">
                <FaPlay />
                <span>🎪 Explore Events</span>
              </span>
            </button>
          </Link>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm animate-fade-in-delayed">
          <span className="px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-full border border-white/20 text-green-100">
            ✅ Instant Booking
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-white/20 text-blue-100">
            🔒 Secure Payments
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-orange-400/20 to-red-500/20 backdrop-blur-sm rounded-full border border-white/20 text-orange-100">
            🎁 Best Deals
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white z-30 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm hover:from-purple-600/50 hover:to-indigo-600/50 p-4 rounded-2xl transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg group"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} className="group-hover:animate-pulse" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 text-white z-30 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm hover:from-purple-600/50 hover:to-indigo-600/50 p-4 rounded-2xl transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg group"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} className="group-hover:animate-pulse" />
      </button>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative transition-all duration-300 hover:scale-125 group ${
              index === currentIndex ? "w-12 h-4" : "w-4 h-4"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-full h-full rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 shadow-lg"
                  : "bg-white/50 group-hover:bg-white/80"
              }`}
            />
            {index === currentIndex && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse opacity-50"></div>
            )}
          </button>
        ))}
      </div>

      {/* Debug info - styled to match theme */}
      <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm text-white p-3 rounded-xl text-sm z-50 border border-white/20">
        <div className="flex items-center space-x-2 mb-1">
          <FaTicketAlt size={12} className="text-pink-400" />
          <span>
            Slide: {currentIndex + 1}/{images.length}
          </span>
        </div>
        <div>Status: {isImageLoaded ? "✅ Loaded" : "⏳ Loading..."}</div>
        <div>Image: {imageExists ? "✅ Available" : "❌ Error"}</div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up-delayed {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out 0.5s both; }
        .animate-slide-up { animation: slide-up 1s ease-out 0.8s both; }
        .animate-slide-up-delayed { animation: slide-up-delayed 1s ease-out 1.2s both; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out 1.6s both; }
      `}</style>
    </div>
  );
};

export default Hero;
