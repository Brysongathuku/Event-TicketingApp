import { toast } from "sonner";
import type { TIEvent } from "../../features/events/eventAPI";
import { eventApi } from "../../features/events/eventAPI";

type DeleteEventProps = {
  event: TIEvent | null;
};

const DeleteEvent = ({ event }: DeleteEventProps) => {
  const [deleteEvent, { isLoading }] = eventApi.useDeleteEventMutation({
    fixedCacheKey: "deleteEvent",
  });

  const handleDelete = async () => {
    try {
      if (!event) {
        toast.error("No event selected for deletion.");
        return;
      }
      await deleteEvent(event.eventID); // Assuming your event ID is `eventID`
      toast.success("Event deleted successfully!");
      (
        document.getElementById("delete_event_modal") as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  return (
    <dialog id="delete_event_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete Event</h3>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{event?.title}</span>?
        </p>
        <div className="modal-action flex gap-4">
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner text-primary" />{" "}
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() =>
              (
                document.getElementById(
                  "delete_event_modal"
                ) as HTMLDialogElement
              )?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteEvent;
