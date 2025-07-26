import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { venuesApi, type TVenue } from "../../../features/Venue/VenueApi";
import { toast } from "sonner";

type UpdateVenueProps = {
  venue: TVenue | null;
};

type UpdateVenueInputs = {
  venueName: string;
  description: string;
  address: string;
  capacity: number;
  imageUrl: string | null;
};

const schema = yup.object({
  venueName: yup
    .string()
    .max(100, "Max 100 characters")
    .required("Venue name is required"),
  description: yup
    .string()
    .max(500, "Max 500 characters")
    .required("Description is required"),
  address: yup
    .string()
    .max(200, "Max 200 characters")
    .required("Address is required"),
  capacity: yup
    .number()
    .required("Capacity is required")
    .positive("Capacity must be positive")
    .integer("Capacity must be a whole number")
    .min(10, "Minimum capacity is 10")
    .max(100000, "Maximum capacity is 100,000"),
  imageUrl: yup.string().url("Must be a valid URL").nullable().defined(),
});

const UpdateVenue = ({ venue }: UpdateVenueProps) => {
  const [updateVenue, { isLoading }] = venuesApi.useUpdateVenueMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateVenueInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      venueName: "",
      description: "",
      address: "",
      capacity: 0,
      imageUrl: null,
    },
  });

  useEffect(() => {
    if (venue) {
      setValue("venueName", venue.venueName);
      setValue("description", venue.description || "");
      setValue("address", venue.address);
      setValue("capacity", venue.capacity);
      setValue("imageUrl", venue.imageUrl || null);
    } else {
      reset();
    }
  }, [venue, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateVenueInputs> = async (data) => {
    try {
      if (!venue) {
        toast.error("No venue selected for update.");
        return;
      }

      await updateVenue({
        venueID: venue.venueID,
        ...data,
      }).unwrap();

      toast.success(`${venue.venueName} updated successfully!`);
      reset();
      (
        document.getElementById("update_venue_modal") as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error(`Failed to update ${venue?.venueName}. Please try again.`);
    }
  };

  return (
    <dialog id="update_venue_modal" className="modal">
      <div className="modal-box bg-gray-100 border border-gray-300 w-full max-w-2xl mx-auto rounded-lg shadow-xl">
        <div className="modal-action absolute right-4 top-4">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => {
              (
                document.getElementById(
                  "update_venue_modal"
                ) as HTMLDialogElement
              )?.close();
              reset();
            }}
          >
            ✕
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Update {venue?.venueName || "Venue"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Venue Name*</span>
              </label>
              <input
                type="text"
                {...register("venueName")}
                className="input input-bordered w-full bg-white text-gray-900"
                placeholder="Enter venue name"
              />
              {errors.venueName && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.venueName.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Capacity*</span>
              </label>
              <input
                type="number"
                {...register("capacity")}
                className="input input-bordered w-full bg-white text-gray-900"
                placeholder="Enter capacity"
              />
              {errors.capacity && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.capacity.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Address*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              className="input input-bordered w-full bg-white text-gray-900"
              placeholder="Enter full address"
            />
            {errors.address && (
              <span className="text-xs text-red-500 mt-1">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Description*</span>
            </label>
            <textarea
              {...register("description")}
              className="textarea textarea-bordered w-full bg-white text-gray-900"
              rows={3}
              placeholder="Enter venue description"
            />
            {errors.description && (
              <span className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700">Image URL</span>
            </label>
            <input
              type="text"
              {...register("imageUrl")}
              className="input input-bordered w-full bg-white text-gray-900"
              placeholder="https://example.com/venue-image.jpg"
            />
            {errors.imageUrl && (
              <span className="text-xs text-red-500 mt-1">
                {errors.imageUrl.message}
              </span>
            )}
            {venue?.imageUrl && (
              <div className="mt-2">
                <label className="label">
                  <span className="label-text text-gray-700">
                    Current Image
                  </span>
                </label>
                <img
                  src={venue.imageUrl}
                  alt="Current venue"
                  className="w-full max-h-48 object-contain rounded-lg border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="modal-action mt-8">
            <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  (
                    document.getElementById(
                      "update_venue_modal"
                    ) as HTMLDialogElement
                  )?.close();
                  reset();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !isDirty}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default UpdateVenue;
