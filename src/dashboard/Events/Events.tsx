import { useState } from "react";
import { eventApi, type TIEvent } from "../../features/events/eventAPI";
import {
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import { MdDeleteForever, MdAttachMoney } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import UpdateEvent from "./UpdateEvent"; // Import your update component
import DeleteEvent from "./DeleteEvent"; // Import your delete component
import EventModal from "./MakeEvent"; // Import your create component

const Events = () => {
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = eventApi.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
  });
  const [isModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TIEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<TIEvent | null>(null);

  const handleEdit = (event: TIEvent) => {
    setSelectedEvent(event);
    (
      document.getElementById("update_event_modal") as HTMLDialogElement
    )?.showModal();
  };
  const handleOpen = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(
      "my_modal_5"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };
  const handleDelete = (event: TIEvent) => {
    setEventToDelete(event);
    (
      document.getElementById("delete_event_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCreate = () => {
    (
      document.getElementById("create_event_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleBook = (event: TIEvent) => {
    // Handle booking logic here
    console.log("Booking event:", event.eventID);
    // You can add your booking logic or navigate to booking page
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <EventModal isOpen={isModalOpen} onClose={handleClose} />

      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Events Management</h2>

        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
          onClick={handleOpen}
        >
          Create New Event
        </button>
      </div>

      {/* Modals */}

      <UpdateEvent event={selectedEvent} />
      <DeleteEvent event={eventToDelete} />
      {/* <EventModal event={eventToCreate} /> */}

      {/* Loading / Error */}
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

      {/* Display Events as Cards */}
      {eventsData && eventsData.data && eventsData.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.data.map((event: TIEvent) => (
            <div
              key={event.eventID}
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="card-body p-6">
                {/* Event Title */}
                <h3 className="card-title text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {event.description}
                </p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-blue-500" size={14} />
                    <span className="text-gray-700 font-medium">
                      {event.eventDate}
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

                {/* Tickets Availability */}
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

                  {/* Progress Bar */}
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

                {/* Action Buttons */}
                <div className="card-actions justify-end gap-2">
                  <button
                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => handleBook(event)}
                    disabled={event.availableTickets === 0}
                  >
                    <FaShoppingCart size={14} />
                    Book
                  </button>
                  <button
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => handleEdit(event)}
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => handleDelete(event)}
                  >
                    <MdDeleteForever size={16} />
                    Delete
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
                No Events Found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first event!
              </p>
              <button
                className="btn btn-primary px-6 py-3 rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
                onClick={handleCreate}
              >
                <FaPlus size={16} />
                Create Your First Event
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Events;
