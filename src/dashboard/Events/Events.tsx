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
import UpdateEvent from "./UpdateEvent";
import DeleteEvent from "./DeleteEvent";
import EventModal from "./MakeEvent";

const AdminEvents = () => {
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <EventModal isOpen={isModalOpen} onClose={handleClose} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Events Management
        </h2>
        <button
          className="btn btn-primary btn-sm sm:btn-md gap-2"
          onClick={handleOpen}
        >
          <FaPlus size={14} />
          Create Event
        </button>
      </div>

      {/* Modals */}
      <UpdateEvent event={selectedEvent} />
      <DeleteEvent event={eventToDelete} />

      {/* Loading State */}
      {eventsLoading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Error State */}
      {eventsError && (
        <div className="alert alert-error mb-6">
          <span>Error loading events</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eventsData?.data?.map((event: TIEvent) => (
          <div
            key={event.eventID}
            className="card bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            {/* Event Image - Improved display */}
            <figure className="relative h-48 w-full overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </figure>

            {/* Card Body */}
            <div className="card-body p-5">
              <h3 className="card-title text-lg line-clamp-1 mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-info" size={14} />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-success" size={14} />
                  <span>
                    {new Date(event.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-error" size={14} />
                  <span className="truncate">Venue {event.venueID}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTicketAlt className="text-secondary" size={14} />
                  <span>
                    {event.availableTickets}/{event.totalTickets} tickets
                  </span>
                </div>
              </div>

              {/* Ticket Price at Bottom */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <MdAttachMoney className="text-yellow-500" size={18} />
                    <span>{event.ticketPrice}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-info gap-1"
                      onClick={() => handleEdit(event)}
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error gap-1"
                      onClick={() => handleDelete(event)}
                    >
                      <MdDeleteForever size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!eventsLoading && eventsData?.data?.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-4xl text-gray-300 mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              Get started by creating your first event!
            </p>
            <button className="btn btn-primary gap-2" onClick={handleCreate}>
              <FaPlus size={14} />
              Create Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
