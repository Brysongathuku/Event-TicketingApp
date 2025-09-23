import React, { useState } from "react";
import { eventApi } from "../../features/events/eventAPI";
import { useNavigate } from "react-router";
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
  imageUrl?: string;
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
  imageUrl: "",
};
// Removed useNavigate from top-level scope

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
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  // FIXED: Cloudinary upload function with correct values
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "eventix_events"); // Your events preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxrez1nqd/image/upload`, // Your actual cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed. Please try again.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setEventFormData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      alert("Failed to upload image. Please try again.");
      console.log(error);
    } finally {
      setImageUploading(false);
    }
  };

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
        imageUrl: eventFormData.imageUrl || null,
      };

      await createEvent(eventData).unwrap();
      alert("Event created successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    }
    setTimeout(() => {
      navigate("/admin/dashboard/events");
    }, 1000);
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <dialog
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Create New Event
              </h2>
              <p className="text-blue-100 mt-1">
                Fill in the details to create your event
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200"
              disabled={isLoading || imageUploading}
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
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Image Upload */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Event Image
              </label>
              <div className="flex flex-col items-center space-y-4">
                {eventFormData.imageUrl ? (
                  <div className="relative">
                    <img
                      src={eventFormData.imageUrl}
                      alt="Event preview"
                      className="w-48 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEventFormData((prev) => ({ ...prev, imageUrl: "" }))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">No image selected</p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={imageUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {imageUploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      "Choose Image"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={eventFormData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter event title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={eventFormData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter event description..."
              />
            </div>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={eventFormData.eventDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={eventFormData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={eventFormData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ticket Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={eventFormData.ticketPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Available Tickets *
                </label>
                <input
                  type="number"
                  name="availableTickets"
                  value={eventFormData.availableTickets}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Tickets *
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  value={eventFormData.totalTickets}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Venue ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue ID *
              </label>
              <input
                type="number"
                name="venueID"
                value={eventFormData.venueID}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter venue ID..."
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="isActive"
                checked={eventFormData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700 font-medium">
                Event is active and visible to users
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading || imageUploading}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || imageUploading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EventModal;
