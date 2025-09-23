import { useState } from "react";
import {
  paymentApi,
  type TIPayment,
} from "../../../features/Payments/paymentsApi";
import { bookingApi, type TIBooking } from "../../../features/Bookings/bookingAPI";
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
  FaCreditCard,
 
  FaMobile,
} from "react-icons/fa";
import { MdAttachMoney, MdPayment } from "react-icons/md";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";

const UserPayments = () => {
  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.user);
  const customerID = currentUser?.user?.user_id;

  const [selectedPayment, setSelectedPayment] = useState<TIPayment | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user's payments
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = paymentApi.useGetPaymentsByCustomerIdQuery(customerID as number, {
    skip: !customerID, // Skip query if no customerID
    refetchOnMountOrArgChange: true,
  });

  // Fetch bookings data to get booking details
  const { data: bookingsData, isLoading: bookingsLoading } =
    bookingApi.useGetBookingsByCustomerIdQuery(customerID as number, {
      skip: !customerID,
    });

  // Fetch events data to get event details
  const { data: eventsData, isLoading: eventsLoading } =
    eventApi.useGetEventsQuery(undefined);

  // Get booking details by bookingID
  const getBookingDetails = (bookingID: number): TIBooking | null => {
    if (!bookingsData?.data) return null;
    return (
      bookingsData.data.find((booking: TIBooking) => booking.bookingID === bookingID) ||
      null
    );
  };

  // Get event details by eventID
  const getEventDetails = (eventID: number): TIEvent | null => {
    if (!eventsData?.data) return null;
    return (
      eventsData.data.find((event: TIEvent) => event.eventID === eventID) ||
      null
    );
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      "M-Pesa": <FaMobile className="text-green-600" size={16} />,
      "Stripe": <FaCreditCard className="text-blue-600" size={16} />,
      "Card": <FaCreditCard className="text-purple-600" size={16} />,
    };
    return icons[method as keyof typeof icons] || <MdPayment className="text-gray-600" size={16} />;
  };

  // Get payment status badge styling
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        icon: <AiOutlineCheckCircle size={16} />,
        class: "bg-green-100 text-green-800 border-green-200",
        text: "Completed",
      },
      pending: {
        icon: <AiOutlineClockCircle size={16} />,
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      failed: {
        icon: <AiOutlineCloseCircle size={16} />,
        class: "bg-red-100 text-red-800 border-red-200",
        text: "Failed",
      },
      refunded: {
        icon: <AiOutlineExclamationCircle size={16} />,
        class: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Refunded",
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
      await refetchPayments();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle view payment details
  const handleViewDetails = (payment: TIPayment) => {
    setSelectedPayment(payment);
    (
      document.getElementById("payment_details_modal") as HTMLDialogElement
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
            You need to be logged in to view your payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Payments</h2>
        <button
          onClick={handleRefresh}
          className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={isRefreshing || paymentsLoading}
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
      {(paymentsLoading || bookingsLoading || eventsLoading) && !isRefreshing && (
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="ml-4 text-lg text-gray-600">Loading your payments...</p>
        </div>
      )}

      {paymentsError && (
        <div className="alert alert-error mb-6 shadow-lg">
          <p className="text-red-500 font-medium">Error fetching payments</p>
        </div>
      )}

      {/* Payments List */}
      {paymentsData && paymentsData.data && paymentsData.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paymentsData.data.map((payment: TIPayment) => {
            const bookingDetails = getBookingDetails(payment.bookingID);
            const eventDetails = bookingDetails ? getEventDetails(bookingDetails.eventID) : null;

            return (
              <div
                key={payment.paymentID}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Event Image */}
                {eventDetails && (
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={
                        eventDetails?.imageUrl ||
                        getFallbackImage(eventDetails.eventID)
                      }
                      alt={eventDetails?.title || "Event"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackImage(eventDetails.eventID);
                      }}
                    />
                  </figure>
                )}

                <div className="card-body p-6">
                  {/* Payment Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {eventDetails?.title || `Booking ID: ${payment.bookingID}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Payment #{payment.paymentID}
                      </p>
                    </div>
                    <div>{getPaymentStatusBadge(payment.paymentStatus)}</div>
                  </div>

                  {/* Event Details */}
                  {eventDetails && bookingDetails && (
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-blue-500" size={14} />
                        <span className="text-gray-700">
                          {new Date(eventDetails.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaClock className="text-green-500" size={14} />
                        <span className="text-gray-700">
                          {eventDetails.startTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaTicketAlt className="text-purple-500" size={14} />
                        <span className="text-gray-700">
                          {bookingDetails.numberOfTickets} tickets
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-red-500" size={14} />
                        <span className="text-gray-700">
                          Venue {eventDetails.venueID}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MdAttachMoney className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        <strong>${payment.amount}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm text-gray-700">
                        <strong>{payment.paymentMethod}</strong>
                      </span>
                    </div>
                    {payment.transactionID && (
                      <div className="flex items-center gap-2 col-span-2">
                        <FaReceipt className="text-blue-500" size={14} />
                        <span className="text-sm text-gray-700">
                          Transaction: {payment.transactionID}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 col-span-2">
                      <FaCalendarAlt className="text-blue-500" size={14} />
                      <span className="text-sm text-gray-700">
                        Payment Date:{" "}
                        {payment.paymentDate 
                          ? new Date(payment.paymentDate).toLocaleDateString()
                          : new Date(payment.createdAt || "").toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions justify-end gap-2">
                    <button
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => handleViewDetails(payment)}
                    >
                      <FaEye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !paymentsLoading &&
        !bookingsLoading &&
        !eventsLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl text-gray-300 mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Payments Found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't made any payments yet. Book an event to see your payment history!
              </p>
            </div>
          </div>
        )
      )}

      {/* Payment Details Modal */}
      <dialog id="payment_details_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {selectedPayment && (
            <div>
              <h3 className="font-bold text-lg mb-4">Payment Details</h3>

              {/* Event Image in Modal */}
              {(() => {
                const bookingDetails = getBookingDetails(selectedPayment.bookingID);
                const eventDetails = bookingDetails ? getEventDetails(bookingDetails.eventID) : null;
                
                return eventDetails && (
                  <figure className="h-48 rounded-lg overflow-hidden mb-4">
                    <img
                      src={
                        eventDetails?.imageUrl ||
                        getFallbackImage(eventDetails.eventID)
                      }
                      alt={eventDetails?.title || "Event"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackImage(eventDetails.eventID);
                      }}
                    />
                  </figure>
                );
              })()}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment ID
                    </label>
                    <p className="text-lg">{selectedPayment.paymentID}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking ID
                    </label>
                    <p className="text-lg">{selectedPayment.bookingID}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Amount
                    </label>
                    <p className="text-lg font-bold text-green-600">
                      ${selectedPayment.amount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment Method
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      <p className="text-lg">{selectedPayment.paymentMethod}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment Status
                    </label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(selectedPayment.paymentStatus)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment Date
                    </label>
                    <p className="text-lg">
                      {selectedPayment.paymentDate 
                        ? new Date(selectedPayment.paymentDate).toLocaleString()
                        : "Not specified"
                      }
                    </p>
                  </div>
                  {selectedPayment.transactionID && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Transaction ID
                      </label>
                      <p className="text-lg font-mono text-blue-600">
                        {selectedPayment.transactionID}
                      </p>
                    </div>
                  )}
                  {selectedPayment.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created At
                      </label>
                      <p className="text-lg">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedPayment.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Updated At
                      </label>
                      <p className="text-lg">
                        {new Date(selectedPayment.updatedAt).toLocaleString()}
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

export default UserPayments;