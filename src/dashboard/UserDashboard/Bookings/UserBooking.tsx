import { useState } from "react";
import {
  bookingApi,
  type TIBooking,
} from "../../../features/Bookings/bookingAPI";
import { eventApi, type TIEvent } from "../../../features/events/eventAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaReceipt,
  FaEye,
  FaSync,
} from "react-icons/fa";
import { MdAttachMoney, MdCancel } from "react-icons/md";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

const UserBooking = () => {
  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.user);
  const customerID = currentUser?.user?.user_id;

  const [selectedBooking, setSelectedBooking] = useState<TIBooking | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user's bookings
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = bookingApi.useGetBookingsByCustomerIdQuery(customerID as number, {
    skip: !customerID, // Skip query if no customerID
    refetchOnMountOrArgChange: true,
  });

  // Fetch events data to get event details
  const { data: eventsData, isLoading: eventsLoading } =
    eventApi.useGetEventsQuery(undefined);

  // Update booking mutation
  const [updateBooking, { isLoading: updateLoading }] =
    bookingApi.useUpdateBookingMutation();

  // Get event details by eventID
  const getEventDetails = (eventID: number): TIEvent | null => {
    if (!eventsData?.data) return null;
    return (
      eventsData.data.find((event: TIEvent) => event.eventID === eventID) ||
      null
    );
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        icon: <AiOutlineCheckCircle size={16} />,
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Confirmed",
      },
      pending: {
        icon: <AiOutlineClockCircle size={16} />,
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      cancelled: {
        icon: <AiOutlineCloseCircle size={16} />,
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Cancelled",
      },
    } as const;

    const normalizedStatus = status.toLowerCase() as keyof typeof statusConfig;
    const config = statusConfig[normalizedStatus] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchBookings();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (booking: TIBooking) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateBooking({
          id: booking.bookingID,
          bookingStatus: "cancelled",
        }).unwrap();
        await refetchBookings();
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  // Handle view booking details
  const handleViewDetails = (booking: TIBooking) => {
    setSelectedBooking(booking);
    (
      document.getElementById("booking_details_modal") as HTMLDialogElement
    )?.showModal();
  };

  // Get fallback image if event image fails to load
  const getFallbackImage = (eventId: number) => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop",
    ];
    return fallbackImages[eventId % fallbackImages.length];
  };

  if (!customerID) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Please Log In
          </h3>
          <p className="text-gray-500">
            You need to be logged in to view your bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
        <button
          onClick={handleRefresh}
          className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={isRefreshing || bookingsLoading}
        >
          {isRefreshing ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Refreshing...
            </>
          ) : (
            <>
              <FaSync size={14} />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Loading / Error */}
      {(bookingsLoading || eventsLoading) && !isRefreshing && (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="ml-4 text-lg text-gray-600">Loading your bookings...</p>
        </div>
      )}

      {bookingsError && (
        <div className="alert alert-error mb-6 shadow-lg">
          <p className="text-red-500 font-medium">Error fetching bookings</p>
        </div>
      )}

      {/* Bookings List */}
      {bookingsData && bookingsData.data && bookingsData.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookingsData.data.map((booking: TIBooking) => {
            const eventDetails = getEventDetails(booking.eventID);

            return (
              <div
                key={booking.bookingID}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Event Image */}
                <figure className="h-48 overflow-hidden">
                  <img
                    src={
                      eventDetails?.imageUrl ||
                      getFallbackImage(booking.eventID)
                    }
                    alt={eventDetails?.title || "Event"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getFallbackImage(booking.eventID);
                    }}
                  />
                </figure>

                <div className="card-body p-6">
                  {/* Booking Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {eventDetails?.title || `Event ID: ${booking.eventID}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Booking #{booking.bookingID}
                      </p>
                    </div>
                    <div>{getStatusBadge(booking.bookingStatus)}</div>
                  </div>

                  {/* Event Details */}
                  {eventDetails && (
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-blue-500" size={14} />
                        <span className="text-gray-700">
                          {new Date(
                            eventDetails.eventDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaClock className="text-green-500" size={14} />
                        <span className="text-gray-700">
                          {eventDetails.startTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-red-500" size={14} />
                        <span className="text-gray-700">
                          Venue {eventDetails.venueID}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MdAttachMoney className="text-yellow-500" size={16} />
                        <span className="text-gray-700">
                          ${eventDetails.ticketPrice} per ticket
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaTicketAlt className="text-purple-500" size={14} />
                      <span className="text-sm text-gray-700">
                        <strong>{booking.numberOfTickets}</strong> tickets
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaReceipt className="text-green-500" size={14} />
                      <span className="text-sm text-gray-700">
                        <strong>${booking.totalAmount}</strong> total
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <FaCalendarAlt className="text-blue-500" size={14} />
                      <span className="text-sm text-gray-700">
                        Booked on:{" "}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end gap-2">
                    <button
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <FaEye size={14} />
                      View Details
                    </button>

                    {booking.bookingStatus === "confirmed" && (
                      <button
                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        onClick={() => handleCancelBooking(booking)}
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <MdCancel size={14} />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !bookingsLoading &&
        !eventsLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl text-gray-300 mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't made any bookings yet. Start exploring events!
              </p>
            </div>
          </div>
        )
      )}

      {/* Booking Details Modal */}
      <dialog id="booking_details_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {selectedBooking && (
            <div>
              <h3 className="font-bold text-lg mb-4">Booking Details</h3>

              {/* Event Image in Modal */}
              <figure className="h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    getEventDetails(selectedBooking.eventID)?.imageUrl ||
                    getFallbackImage(selectedBooking.eventID)
                  }
                  alt={
                    getEventDetails(selectedBooking.eventID)?.title || "Event"
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImage(
                      selectedBooking.eventID
                    );
                  }}
                />
              </figure>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking ID
                    </label>
                    <p className="text-lg">{selectedBooking.bookingID}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Event ID
                    </label>
                    <p className="text-lg">{selectedBooking.eventID}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Number of Tickets
                    </label>
                    <p className="text-lg">{selectedBooking.numberOfTickets}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Amount
                    </label>
                    <p className="text-lg font-bold text-green-600">
                      ${selectedBooking.totalAmount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedBooking.bookingStatus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking Date
                    </label>
                    <p className="text-lg">
                      {new Date(selectedBooking.bookingDate).toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created At
                      </label>
                      <p className="text-lg">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default UserBooking;
