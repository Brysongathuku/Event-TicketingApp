import React, { useState } from "react";
import { eventApi } from "../../features/events/eventAPI";

// Types and Interfaces
interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  availableTickets: number;
  totalTickets: number;
  venueID: number;
  isActive: boolean;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Constants
const INITIAL_FORM_DATA: EventFormData = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  ticketPrice: 0,
  availableTickets: 0,
  totalTickets: 0,
  venueID: 0,
  isActive: true,
};

// Utility Functions
const formatDateTime = (date: string, time: string): string => {
  return `${date} ${time}:00.000`;
};

const validateEventForm = (formData: EventFormData): string | null => {
  if (!formData.title.trim()) {
    return "Event title is required";
  }

  if (!formData.eventDate || !formData.startTime || !formData.endTime) {
    return "Event date, start time, and end time are required";
  }

  if (formData.availableTickets > formData.totalTickets) {
    return "Available tickets cannot exceed total tickets";
  }

  if (formData.venueID <= 0) {
    return "Please enter a valid venue ID";
  }

  return null;
};

// Event Creation Modal Component
const EventModal: React.FC<EventModalProps> = () => {
  const [eventFormData, setEventFormData] =
    useState<EventFormData>(INITIAL_FORM_DATA);
  const [createEvent, { isLoading }] = eventApi.useCreateEventsMutation();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEventFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setEventFormData((prev) => ({
        ...prev,
        [name]:
          name === "ticketPrice" ||
          name === "availableTickets" ||
          name === "totalTickets" ||
          name === "venueID"
            ? Number(value)
            : value,
      }));
    }
  };

  const resetForm = () => {
    setEventFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateEventForm(eventFormData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const eventData = {
        title: eventFormData.title.trim(),
        description: eventFormData.description.trim() || null,
        eventDate: formatDateTime(
          eventFormData.eventDate,
          eventFormData.startTime
        ),
        startTime: formatDateTime(
          eventFormData.eventDate,
          eventFormData.startTime
        ),
        endTime: formatDateTime(eventFormData.eventDate, eventFormData.endTime),
        ticketPrice: eventFormData.ticketPrice.toFixed(2),
        availableTickets: eventFormData.availableTickets,
        totalTickets: eventFormData.totalTickets,
        isActive: eventFormData.isActive,
        venueID: eventFormData.venueID,
      };

      await createEvent(eventData).unwrap();
      alert("Event created successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <dialog
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle
  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Event
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={eventFormData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={eventFormData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event description..."
              />
            </div>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventFormData.eventDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={eventFormData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={eventFormData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price *
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={eventFormData.ticketPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Tickets *
                </label>
                <input
                  type="number"
                  name="availableTickets"
                  value={eventFormData.availableTickets}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tickets *
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  value={eventFormData.totalTickets}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Venue ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue ID *
              </label>
              <input
                type="number"
                name="venueID"
                value={eventFormData.venueID}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter venue ID..."
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={eventFormData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Event is active
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors font-medium"
              >
                {isLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EventModal;
