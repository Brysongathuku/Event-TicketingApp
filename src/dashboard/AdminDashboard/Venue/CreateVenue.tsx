import { useState } from "react";
import { useRegisterVenueMutation } from "../../../features/Venue/VenueApi";
import type { TCreateVenue } from "../../../dashboard/AdminDashboard/Types/venues";

const CreateVenue = () => {
  const [registerVenue, { isLoading, error }] = useRegisterVenueMutation();

  const [formData, setFormData] = useState<TCreateVenue>({
    venueName: "",
    address: "",
    description: "",
    capacity: 0,
    imageUrl: "", // Added imageUrl field
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerVenue(formData).unwrap();
      // Reset form
      setFormData({
        venueName: "",
        address: "",
        description: "",
        capacity: 0,
        imageUrl: "",
      });
      // Close modal
      (
        document.getElementById("create_venue_modal") as HTMLDialogElement
      )?.close();
    } catch (err) {
      console.error("Failed to create venue:", err);
    }
  };

  return (
    <dialog id="create_venue_modal" className="modal">
      <div className="modal-box max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-6">Create New Venue</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>Error: {error.toString()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Venue Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Venue Name*</span>
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="Enter venue name"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Capacity */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Capacity*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                className="input input-bordered w-full"
                min="1"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter venue description"
              className="textarea textarea-bordered h-24"
              rows={3}
            />
          </div>

          {/* Image URL - Simple text input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL (e.g. from Unsplash)"
              className="input input-bordered w-full"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <label className="label">
                  <span className="label-text">Image Preview</span>
                </label>
                <img
                  src={formData.imageUrl}
                  alt="Venue preview"
                  className="w-full max-h-48 object-contain rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={() =>
                (
                  document.getElementById(
                    "create_venue_modal"
                  ) as HTMLDialogElement
                )?.close()
              }
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Venue"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateVenue;
