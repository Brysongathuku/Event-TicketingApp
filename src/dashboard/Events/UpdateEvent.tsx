import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { eventApi } from "../../features/events/eventAPI";
import type { TIEvent } from "../../features/events/eventAPI";
import { toast } from "sonner";

type UpdateEventProps = {
  event: TIEvent | null;
};

type UpdateEventInputs = {
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  ticketPrice: string;
  availableTickets: number;
  totalTickets: number;
  venueID: number;
};

const schema: yup.ObjectSchema<UpdateEventInputs> = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().max(255, "Max 255 characters").optional(),
  eventDate: yup.string().required("Event date is required"),
  startTime: yup.string().required("Start time is required"),
  ticketPrice: yup.string().required("Ticket price is required"),
  availableTickets: yup.number().required("Available tickets required").min(0),
  totalTickets: yup.number().required("Total tickets required").min(1),
  venueID: yup.number().required("Venue ID required"),
});

const UpdateEvent = ({ event }: UpdateEventProps) => {
  const [updateEvent, { isLoading }] = eventApi.useUpdateEventMutation({
    fixedCacheKey: "updateEvent",
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateEventInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description || "");
      setValue("eventDate", event.eventDate.slice(0, 10));
      setValue("startTime", event.startTime);
      setValue("ticketPrice", event.ticketPrice);
      setValue("availableTickets", event.availableTickets);
      setValue("totalTickets", event.totalTickets);
      setValue("venueID", event.venueID);
    } else {
      reset();
    }
  }, [event, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateEventInputs> = async (data) => {
    if (!event) {
      toast.error("No event selected for update.");
      return;
    }

    try {
      const response = await updateEvent({
        ...data,
        id: event.eventID,
      }).unwrap();
      console.log("Event updated:", response);
      toast.success("Event updated successfully!");
      reset();

      (
        document.getElementById("update_event_modal") as HTMLDialogElement
      )?.close();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update event.");
    }
  };

  return (
    <dialog id="update_event_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xl mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("title")}
            placeholder="Event Title"
            className="input text-black"
          />
          {errors.title && (
            <span className="text-red-400">{errors.title.message}</span>
          )}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="textarea text-black"
          />
          {errors.description && (
            <span className="text-red-400">{errors.description.message}</span>
          )}

          <input
            type="date"
            {...register("eventDate")}
            className="input text-black"
          />
          {errors.eventDate && (
            <span className="text-red-400">{errors.eventDate.message}</span>
          )}

          <input
            type="time"
            {...register("startTime")}
            className="input text-black"
          />
          {errors.startTime && (
            <span className="text-red-400">{errors.startTime.message}</span>
          )}

          <input
            {...register("ticketPrice")}
            placeholder="Ticket Price"
            className="input text-black"
          />
          {errors.ticketPrice && (
            <span className="text-red-400">{errors.ticketPrice.message}</span>
          )}

          <input
            type="number"
            {...register("availableTickets")}
            placeholder="Available Tickets"
            className="input text-black"
          />
          {errors.availableTickets && (
            <span className="text-red-400">
              {errors.availableTickets.message}
            </span>
          )}

          <input
            type="number"
            {...register("totalTickets")}
            placeholder="Total Tickets"
            className="input text-black"
          />
          {errors.totalTickets && (
            <span className="text-red-400">{errors.totalTickets.message}</span>
          )}

          <input
            type="number"
            {...register("venueID")}
            placeholder="Venue ID"
            className="input text-black"
          />
          {errors.venueID && (
            <span className="text-red-400">{errors.venueID.message}</span>
          )}

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                "Update"
              )}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                (
                  document.getElementById(
                    "update_event_modal"
                  ) as HTMLDialogElement
                )?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateEvent;
