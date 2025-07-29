import { eventApi, type TIEvent } from "../../../features/events/eventAPI";
import { Link } from "react-router";
import {
  FaClock,
  FaTicketAlt,
  FaHeart,
  FaShare,
  FaUsers,
} from "react-icons/fa";
import { MdAttachMoney, MdLocationOn } from "react-icons/md";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { useState } from "react";
// import Navbar from "../../../components/Navbar";
// import Footer from "../../../components/footer";

const UserEvents = () => {
  // const navigate = useNavigate();
  const [likedEvents, setLikedEvents] = useState<Set<number>>(new Set());

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = eventApi.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
  });

  const handleInstantPay = (event: TIEvent) => {
    console.log("Instant payment for event:", event.eventID);
    alert(
      `Proceeding to instant payment for ${event.title} - $${event.ticketPrice}`
    );
  };

  const toggleLike = (eventId: number) => {
    setLikedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const getTicketAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "from-green-500 to-emerald-500";
    if (percentage > 20) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return { day, month, weekday };
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "TBD";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getFallbackImage = (eventId: number) => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556325235-7b4ac372efd7?w=400&h=400&fit=crop",
    ];
    return fallbackImages[eventId % fallbackImages.length];
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find and book the perfect events tailored to your interests
            </p>
          </div>
        </div>

        {/* Loading State */}
        {eventsLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 animate-pulse">
              Discovering events for you...
            </p>
          </div>
        )}

        {/* Error State */}
        {eventsError && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Events
              </h3>
              <p className="text-red-600">Please try refreshing the page</p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {eventsData && eventsData.data && eventsData.data.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsData.data.map((event: TIEvent) => {
                const dateInfo = formatDate(event.eventDate);
                const availabilityPercentage =
                  (event.availableTickets / event.totalTickets) * 100;

                return (
                  <div
                    key={event.eventID}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <img
                        src={event.imageUrl || getFallbackImage(event.eventID)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = getFallbackImage(event.eventID);
                        }}
                      />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-800">
                            {dateInfo.day}
                          </div>
                          <div className="text-sm font-medium text-gray-600 uppercase">
                            {dateInfo.month}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dateInfo.weekday}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => toggleLike(event.eventID)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            likedEvents.has(event.eventID)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          <FaHeart size={16} />
                        </button>
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300">
                          <FaShare size={16} />
                        </button>
                      </div>

                      {/* Availability Badge */}
                      {event.availableTickets < 10 &&
                        event.availableTickets > 0 && (
                          <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Only {event.availableTickets} left!
                          </div>
                        )}

                      {event.availableTickets === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                            SOLD OUT
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {event.title}
                        </h3>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3 mb-4 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-600">
                            <FaClock size={16} />
                            <span className="font-medium">
                              {formatTime(event.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-red-500">
                            <MdLocationOn size={18} />
                            <span className="font-medium">
                              Venue {event.venueID}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MdAttachMoney
                              className="text-green-500"
                              size={18}
                            />
                            <span className="text-2xl font-bold text-gray-800">
                              ${event.ticketPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <FaUsers size={14} />
                            <span className="text-sm">
                              {event.totalTickets - event.availableTickets}{" "}
                              going
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Availability */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FaTicketAlt
                              className="text-purple-500"
                              size={16}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Available Tickets
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-800">
                            {event.availableTickets}/{event.totalTickets}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${getTicketAvailabilityColor(
                              event.availableTickets,
                              event.totalTickets
                            )} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${availabilityPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto">
                        <Link to={`/book/${event.eventID}`}>
                          <button
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none text-sm"
                            disabled={event.availableTickets === 0}
                          >
                            <FaShoppingCart size={16} />
                            {event.availableTickets === 0
                              ? "Sold Out"
                              : "Book Now"}
                          </button>
                        </Link>

                        <button
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none text-sm"
                          onClick={() => handleInstantPay(event)}
                          disabled={event.availableTickets === 0}
                        >
                          <FaCreditCard size={16} />
                          {event.availableTickets === 0
                            ? "Sold Out"
                            : "Instant Pay"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          !eventsLoading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-8xl mb-6">🎭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  No Events Available
                </h3>
                <p className="text-gray-500 mb-8 text-lg">
                  Don't worry! Amazing events are coming soon. Check back later
                  for exciting experiences!
                </p>
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UserEvents;
