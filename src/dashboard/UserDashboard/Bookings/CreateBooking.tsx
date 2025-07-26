import { useState, useEffect } from "react";
import { useGetEventByIdQuery } from "../../../features/events/eventAPI";
import { useCreateBookingMutation } from "../../../features/Bookings/bookingAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { MdClose, MdAttachMoney } from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";

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

      await createBooking(bookingData).unwrap();
      onBookingSuccess();
      onClose();
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Book Tickets</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            <MdClose size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">Failed to load event details</div>
        ) : eventData?.data ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Details */}
              <div>
                <div className="card bg-base-100 shadow-sm">
                  <figure className="h-48">
                    <img
                      src={eventData.data.imageUrl || "/placeholder-event.jpg"}
                      alt={eventData.data.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h4 className="card-title">{eventData.data.title}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <FaTicketAlt className="text-primary" />
                      <span>
                        Available: {eventData.data.availableTickets} /{" "}
                        {eventData.data.totalTickets}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MdAttachMoney className="text-primary" />
                      <span>
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
                    <span className="label-text">Number of Tickets</span>
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
                  />
                </div>

                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Ticket Price:</span>
                    <span>${eventData.data.ticketPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Quantity:</span>
                    <span>{ticketCount}</span>
                  </div>
                  <div className="divider my-1"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
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
                  >
                    {isCreating ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </dialog>
  );
};

export default BookingDialog;
