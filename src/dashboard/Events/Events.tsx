import { useState } from "react";
import { eventApi, type TIEvent } from "../../features/events/eventAPI";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import UpdateEvent from "./UpdateEvent"; // Import your update component
import DeleteEvent from "./DeleteEvent"; // Import your delete component
// import CreateEvent from "./CreateEvent"; // Import your create component

const Events = () => {
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = eventApi.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
  });

  const [selectedEvent, setSelectedEvent] = useState<TIEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<TIEvent | null>(null);

  const handleEdit = (event: TIEvent) => {
    setSelectedEvent(event);
    (
      document.getElementById("update_event_modal") as HTMLDialogElement
    )?.showModal();
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
    <div className="p-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FaPlus size={16} />
          create new event
        </button>
      </div>

      {/* Modals */}
      {/* <CreateEvent /> */}
      <UpdateEvent event={selectedEvent} />
      <DeleteEvent event={eventToDelete} />

      {/* Loading / Error */}
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p className="text-red-500">Error fetching events</p>}

      {/* Display Events */}
      {eventsData && eventsData.data && eventsData.data.length > 0 ? (
        <div className="md:overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr className="bg-gray-600 text-white text-md lg:text-lg">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Tickets</th>
                <th className="px-4 py-2">Venue ID</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.data.map((event: TIEvent) => (
                <tr
                  key={event.eventID}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.description}</td>
                  <td className="px-4 py-2">{event.eventDate}</td>
                  <td className="px-4 py-2">{event.startTime}</td>
                  <td className="px-4 py-2">{event.ticketPrice}</td>
                  <td className="px-4 py-2">
                    {event.availableTickets} / {event.totalTickets}
                  </td>
                  <td className="px-4 py-2">{event.venueID}</td>
                  <td className="px-4 py-2 flex space-x-3">
                    <button
                      className="btn btn-sm text-blue-500"
                      onClick={() => handleEdit(event)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="btn btn-sm text-red-500"
                      onClick={() => handleDelete(event)}
                    >
                      <MdDeleteForever size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !eventsLoading && <p>No events found.</p>
      )}
    </div>
  );
};

export default Events;
