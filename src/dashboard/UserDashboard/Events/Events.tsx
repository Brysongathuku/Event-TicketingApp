import { eventApi, type TIEvent } from "../../../features/events/eventAPI";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import CreateBooking from "../Bookings/CreateBooking";
import { useState } from "react";
import type { TIBooking } from "../../../features/Bookings/bookingAPI";

const UserEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<TIEvent | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<TIBooking | null>(
    null
  );

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = eventApi.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
  });

  const handleBookNow = (event: TIEvent) => {
    setSelectedEvent(event);
    const tempBooking: TIBooking = {
      bookingID: 0,
      customerID: 0, // This should be set to the logged-in user's ID
      eventID: event.eventID,
      numberOfTickets: 1,
      totalAmount: event.ticketPrice.toString(),
      bookingDate: new Date().toISOString().split("T")[0],
      bookingStatus: "pending",
    };
    setSelectedBooking(tempBooking);
    (document.getElementById("booking_modal") as HTMLDialogElement).showModal();
  };

  const handleInstantPay = (event: TIEvent) => {
    console.log("Instant payment for event:", event.eventID);
    alert(
      `Proceeding to instant payment for ${event.title} - $${event.ticketPrice}`
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CreateBooking
        selectedEvent={selectedEvent}
        selectedBooking={selectedBooking}
      />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Available Events</h2>
      </div>

      {eventsLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="ml-4 text-lg text-gray-600">Loading events...</p>
        </div>
      )}
      {eventsError && (
        <div className="alert alert-error mb-6 shadow-lg">
          <p className="text-red-500 font-medium">Error fetching events</p>
        </div>
      )}

      {eventsData && eventsData.data && eventsData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.data.map((event: TIEvent) => (
            <div
              key={event.eventID}
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="card-body p-6">
                <h3 className="card-title text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-blue-500" size={14} />
                    <span className="text-gray-700 font-medium">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaClock className="text-green-500" size={14} />
                    <span className="text-gray-700 font-medium">
                      {event.startTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MdAttachMoney className="text-yellow-500" size={16} />
                    <span className="text-gray-700 font-medium">
                      ${event.ticketPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-red-500" size={14} />
                    <span className="text-gray-700 font-medium">
                      Venue {event.venueID}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaTicketAlt className="text-purple-500" size={14} />
                      <span className="text-sm font-medium text-gray-700">
                        Tickets Available
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {event.availableTickets} / {event.totalTickets}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (event.availableTickets / event.totalTickets) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="card-actions justify-center gap-3">
                  <button
                    className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-1 justify-center"
                    onClick={() => handleBookNow(event)}
                    disabled={event.availableTickets === 0}
                  >
                    <FaShoppingCart size={16} />
                    {event.availableTickets === 0 ? "Sold Out" : "Book Now"}
                  </button>

                  <button
                    className="btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-1 justify-center"
                    onClick={() => handleInstantPay(event)}
                    disabled={event.availableTickets === 0}
                  >
                    <FaCreditCard size={16} />
                    {event.availableTickets === 0 ? "Sold Out" : "Pay Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !eventsLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl text-gray-300 mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-500 mb-6">
                Check back later for upcoming events!
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserEvents;
