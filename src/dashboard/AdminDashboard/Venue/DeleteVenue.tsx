import { toast } from "sonner";
import { venuesApi, type TVenue } from "../../../features/Venue/VenueApi";

type DeleteVenueProps = {
  venue: TVenue | null;
};

const DeleteVenue = ({ venue }: DeleteVenueProps) => {
  const [deleteVenue, { isLoading }] = venuesApi.useDeleteVenueMutation();

  const handleDelete = async () => {
    try {
      if (!venue) {
        toast.error("No venue selected for deletion.");
        return;
      }
      await deleteVenue(venue.venueID).unwrap(); // Updated to use venueID from schema
      toast.success(`${venue.venueName} deleted successfully!`);
      (
        document.getElementById("delete_venue_modal") as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error(`Failed to delete ${venue?.venueName}. Please try again.`);
    }
  };

  return (
    <dialog id="delete_venue_modal" className="modal">
      <div className="modal-box bg-base-100 border border-base-300 w-full max-w-md mx-auto rounded-lg shadow-xl">
        <div className="modal-action absolute right-4 top-4">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() =>
              (
                document.getElementById(
                  "delete_venue_modal"
                ) as HTMLDialogElement
              )?.close()
            }
          >
            ✕
          </button>
        </div>

        <div className="text-center space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-error">Delete Venue</h3>

          <div className="py-4">
            {venue?.imageUrl && (
              <div className="avatar mb-4">
                <div className="w-16 h-16 rounded-full mx-auto">
                  <img
                    src={venue.imageUrl}
                    alt={venue.venueName}
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-venue.jpg";
                    }}
                  />
                </div>
              </div>
            )}

            <p className="text-lg">
              Confirm deletion of{" "}
              <span className="font-bold text-primary">{venue?.venueName}</span>
              ?
            </p>

            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <p>📍 {venue?.address || "No address provided"}</p>
              <p>👥 Capacity: {venue?.capacity || "N/A"}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            This will permanently remove all venue data. Associated events will
            need to be updated.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
            <button
              className="btn btn-error btn-outline flex-1"
              onClick={() =>
                (
                  document.getElementById(
                    "delete_venue_modal"
                  ) as HTMLDialogElement
                )?.close()
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-error flex-1"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop click to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DeleteVenue;
