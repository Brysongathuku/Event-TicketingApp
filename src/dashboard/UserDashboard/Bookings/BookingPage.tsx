import { useParams, useNavigate } from "react-router";
import BookingDialog from "./CreateBooking";

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  if (!eventId) return <div>Event not found</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <BookingDialog
        eventId={Number(eventId)}
        isOpen={true}
        onClose={() => navigate(-1)}
        onBookingSuccess={() => navigate("/bookings/success")}
      />
    </div>
  );
};

export default BookingPage;
