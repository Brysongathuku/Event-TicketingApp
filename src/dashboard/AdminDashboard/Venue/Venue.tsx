import { FaEdit, FaUsers } from "react-icons/fa";
import { MdDeleteForever, MdLocationOn } from "react-icons/md";
import CreateVenue from "./CreateVenue";
import { useState } from "react";
import UpdateVenue from "./UpdateVenue";
import DeleteVenue from "./DeleteVenue";
import { venuesApi, type TVenue } from "../../../features/Venue/VenueApi";

const Venues = () => {
  const {
    data: venuesResponse,
    isLoading: venuesLoading,
    error: venuesError,
  } = venuesApi.useGetVenuesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<TVenue | null>(null);

  const handleEdit = (venue: TVenue) => {
    setSelectedVenue(venue);
    (
      document.getElementById("update_venue_modal") as HTMLDialogElement
    )?.showModal();
  };

  const venues = venuesResponse?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Title and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Venues
            </h1>
            <p className="text-gray-600">Manage your event venues</p>
          </div>
          <button
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() =>
              (
                document.getElementById(
                  "create_venue_modal"
                ) as HTMLDialogElement
              )?.showModal()
            }
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Venue
            </span>
          </button>
        </div>

        {/* Modals */}
        <CreateVenue />
        <UpdateVenue venue={selectedVenue} />
        <DeleteVenue venue={venueToDelete} />

        {/* Loading State */}
        {venuesLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-r-4 border-blue-300 animate-pulse"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              Loading venues...
            </p>
          </div>
        )}

        {/* Error State */}
        {venuesError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-medium">
                Error fetching venues: {venuesError.toString()}
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {!venuesLoading && !venuesError && (
          <>
            {/* Empty State */}
            {venues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
                  <div className="text-8xl mb-6">🏟️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No Venues Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first venue to get started managing events!
                  </p>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    onClick={() =>
                      (
                        document.getElementById(
                          "create_venue_modal"
                        ) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    Create First Venue
                  </button>
                </div>
              </div>
            ) : (
              /* Venues Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {venues.map((venue: TVenue) => (
                  <div
                    key={venue.venueID}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group w-full max-w-sm mx-auto"
                  >
                    {/* Square Card Container */}
                    <div
                      className="aspect-square flex flex-col"
                      style={{ minHeight: "320px", maxHeight: "400px" }}
                    >
                      {/* Image Section - Takes up about 60% of the card */}
                      <div className="relative flex-1 overflow-hidden">
                        {venue.imageUrl ? (
                          <img
                            src={venue.imageUrl}
                            alt={venue.venueName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/default-venue.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg
                                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <span className="text-gray-500 text-xs font-medium">
                                No Image
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section - Takes up about 40% of the card */}
                      <div
                        className="p-4 flex flex-col justify-between flex-shrink-0"
                        style={{ minHeight: "40%" }}
                      >
                        <div className="flex-1">
                          {/* Venue Name */}
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                            {venue.venueName || "Unnamed Venue"}
                          </h3>

                          {/* Venue Details */}
                          <div className="space-y-2 mb-3">
                            {/* Address */}
                            <div className="flex items-start space-x-2">
                              <MdLocationOn
                                className="text-gray-400 mt-0.5 flex-shrink-0"
                                size={14}
                              />
                              <p className="text-gray-600 text-xs line-clamp-1">
                                {venue.address || "Address not specified"}
                              </p>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center space-x-2">
                              <FaUsers
                                className="text-gray-400 flex-shrink-0"
                                size={12}
                              />
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                {venue.capacity
                                  ? `${venue.capacity.toLocaleString()}`
                                  : "No limit"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons - Bottom Center */}
                        <div className="flex justify-center space-x-2 mt-auto">
                          <button
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                            onClick={() => handleEdit(venue)}
                          >
                            <FaEdit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center text-sm"
                            onClick={() => {
                              setVenueToDelete(venue);
                              (
                                document.getElementById(
                                  "delete_venue_modal"
                                ) as HTMLDialogElement
                              )?.showModal();
                            }}
                          >
                            <MdDeleteForever size={12} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Venues Count */}
            {venues.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {venues.length}
                  </span>
                  {venues.length === 1 ? " venue" : " venues"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Venues;
