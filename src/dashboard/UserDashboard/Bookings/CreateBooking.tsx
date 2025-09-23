import { useState, useEffect } from "react";
import { useGetEventByIdQuery } from "../../../features/events/eventAPI";
import { useCreateBookingMutation } from "../../../features/Bookings/bookingAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { MdClose, MdAttachMoney } from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "sonner"; // Import from sonner

interface BookingDialogProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

const BookingDialog = ({
  eventId,
  isOpen,
  onClose,
  onBookingSuccess,
}: BookingDialogProps) => {
  const { data: eventData, isLoading, error } = useGetEventByIdQuery(eventId);
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const customer = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate(); // Initialize navigate

  const [ticketCount, setTicketCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (eventData?.data) {
      const price = parseFloat(eventData.data.ticketPrice);
      setTotalAmount(price * ticketCount);
    }
  }, [ticketCount, eventData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer || !eventData?.data) return;

    try {
      const bookingData = {
        customerID: customer.user_id,
        eventID: eventId,
        numberOfTickets: ticketCount,
        totalAmount: totalAmount.toFixed(2),
        bookingDate: new Date().toISOString(),
        bookingStatus: "confirmed" as const,
      };

      // Show loading toast
      const toastId = toast.loading("Processing your booking...");

      await createBooking(bookingData).unwrap();

      // Update toast to success
      toast.success("Booking confirmed successfully!", {
        id: toastId,
        duration: 2000,
      });

      onBookingSuccess();
      onClose();

      // Navigate to bookings page after a short delay
      setTimeout(() => {
        navigate("/user/dashboard/booking"); // or your bookings route
      }, 1000);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      data-testid="booking-dialog"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-2xl font-bold text-gray-800"
              data-testid="booking-dialog-title"
            >
              Book Tickets
            </h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle text-gray-500 hover:text-gray-700"
              data-testid="close-booking-dialog"
            >
              <MdClose size={24} />
            </button>
          </div>

          {isLoading ? (
            <div
              className="flex justify-center py-12"
              data-testid="booking-loading"
            >
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : error ? (
            <div
              className="alert alert-error shadow-lg"
              data-testid="booking-error"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Failed to load event details</span>
              </div>
            </div>
          ) : eventData?.data ? (
            <form onSubmit={handleSubmit} data-testid="booking-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div>
                  <div className="card bg-base-100 shadow-sm">
                    <figure className="h-48">
                      <img
                        src={
                          eventData.data.imageUrl || "/placeholder-event.jpg"
                        }
                        alt={eventData.data.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className="card-body p-4">
                      <h4
                        className="card-title text-lg font-bold"
                        data-testid="event-title-in-dialog"
                      >
                        {eventData.data.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm">
                        <FaTicketAlt className="text-primary" />
                        <span data-testid="available-tickets-info">
                          Available: {eventData.data.availableTickets} /{" "}
                          {eventData.data.totalTickets}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MdAttachMoney className="text-primary" />
                        <span data-testid="price-per-ticket">
                          Price: ${eventData.data.ticketPrice} per ticket
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Number of Tickets
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={eventData.data.availableTickets}
                      value={ticketCount}
                      onChange={(e) =>
                        setTicketCount(
                          Math.min(
                            parseInt(e.target.value) || 1,
                            eventData.data.availableTickets
                          )
                        )
                      }
                      className="input input-bordered w-full"
                      required
                      data-testid="ticket-count-input"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-base-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Ticket Price:</span>
                      <span data-testid="ticket-price-display">
                        ${eventData.data.ticketPrice}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Quantity:</span>
                      <span data-testid="quantity-display">{ticketCount}</span>
                    </div>
                    <div className="divider my-1"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span data-testid="total-amount">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="modal-action mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={
                        isCreating ||
                        ticketCount > eventData.data.availableTickets
                      }
                      data-testid="confirm-booking-button"
                    >
                      {isCreating ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;
