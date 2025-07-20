import { useState, useEffect } from "react";
import { Link } from "react-router";
// Working online images for testing - replace with your local paths once working
const images = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=1200&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&q=80",
];

// Uncomment and try these local image paths instead:
// const images = [
//   "/assets/basket.jpg",
//   "/assets/concert.jpg",
//   "/assets/festival.jpg",
//   "/assets/workshop.jpg"
// ];

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
    }, 5000);
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
          alt={`Slide ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Fallback background - always visible if no image */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 transition-opacity duration-700 ${
            isImageLoaded && imageExists ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Debug info */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm z-50">
          <div>
            Current: {currentIndex + 1}/{images.length}
          </div>
          <div>Loaded: {isImageLoaded ? "Yes" : "No"}</div>
          <div>Exists: {imageExists ? "Yes" : "No"}</div>
        </div>
      </div>

      {/* Very light overlay so images are clearly visible */}
      <div className="absolute inset-0 bg-black bg-opacity-10 z-10" />

      {/* Static Text Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Eventixs
        </h1>
        <p className="text-lg md:text-xl max-w-xl mb-6 drop-shadow-md">
          Discover and book your next big event with ease. Concerts, festivals,
          and conferences — all at your fingertips.
        </p>
        <Link to="/register">
          <button className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
            Get Started with Eventixs
          </button>
        </Link>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white z-30 bg-black bg-opacity-40 hover:bg-opacity-70 p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white z-30 bg-black bg-opacity-40 hover:bg-opacity-70 p-3 rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
