import { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadImage } from "../../../utils/cloudinaryService";
import { userAPI } from "../../../features/users/usersApi";
import type { TUser } from "../../../features/users/usersApi";
import { toast } from "sonner";
import { FaUser, FaUpload, FaEdit } from "react-icons/fa";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  contactPhone: yup.string().default(""), // Allow empty string
  address: yup.string().default(""), // Allow empty string
  imageUrl: yup.string().url("Please enter a valid URL").default(""), // Allow empty string, but validate URL if provided
});

// Form data type that matches TUser structure
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  address: string;
  imageUrl: string;
};

interface UpdateUserProfileProps {
  user: TUser | null;
  refetch?: () => void;
}

const UpdateUserProfile = ({ user, refetch }: UpdateUserProfileProps) => {
  const [updateUser, { isLoading: isUpdating }] =
    userAPI.useUpdateUserMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactPhone: user.contactPhone,
        address: user.address,
        imageUrl: user.imageUrl,
      });
      setPreviewImage(user.imageUrl || null);
      setSelectedFile(null);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user) return;

    try {
      setIsUploading(true);
      let imageUrl = data.imageUrl;

      // Upload new image if selected
      if (selectedFile) {
        toast.loading("Uploading image...");
        try {
          imageUrl = await uploadImage(selectedFile);
          toast.dismiss();
          toast.success("Image uploaded successfully!");
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          toast.dismiss();

          const errorMessage =
            uploadError instanceof Error
              ? uploadError.message
              : "Please try again.";

          toast.error(`Failed to upload image: ${errorMessage}`);
          return;
        }
      }

      // Update user profile
      toast.loading("Updating profile...");

      const updateData = {
        id: user.customerID, // Use customerID as id for the API
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactPhone: data.contactPhone,
        address: data.address,
        imageUrl: imageUrl || "",
      };

      await updateUser(updateData).unwrap();

      toast.dismiss();
      toast.success("Profile updated successfully!");

      // Refetch data to update the UI
      if (refetch) {
        refetch();
      }

      // Close modal
      (document.getElementById("profile_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      toast.dismiss();
      console.error("Update failed:", error);

      // Handle different types of errors
      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as { data: { message?: string } };
        toast.error(
          apiError.data?.message ||
            "Failed to update profile. Please try again."
        );
      } else if (error instanceof Error) {
        toast.error(
          error.message || "Failed to update profile. Please try again."
        );
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleModalClose = () => {
    // Reset form and states when modal closes
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactPhone: user.contactPhone,
        address: user.address,
        imageUrl: user.imageUrl,
      });
      setPreviewImage(user.imageUrl || null);
      setSelectedFile(null);
    }
  };

  if (!user) return null;

  return (
    <dialog id="profile_modal" className="modal" onClose={handleModalClose}>
      <div className="modal-box max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <FaEdit className="text-2xl text-primary" />
          <h3 className="font-bold text-xl">Update User Profile</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Section */}
          <div className="text-center">
            <label className="block text-sm font-medium mb-3">
              Profile Picture
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* Image Preview */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                      }}
                    />
                  ) : (
                    <FaUser className="text-gray-500 text-2xl" />
                  )}
                </div>

                {previewImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isUpdating}
                >
                  <FaUpload className="mr-1" />
                  {previewImage ? "Change Image" : "Upload Image"}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">First Name *</span>
              </label>
              <input
                {...register("firstName")}
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <span className="text-error text-xs mt-1 block">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Last Name *</span>
              </label>
              <input
                {...register("lastName")}
                className={`input input-bordered w-full ${
                  errors.lastName ? "input-error" : ""
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <span className="text-error text-xs mt-1 block">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Email *</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="text-error text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Phone Number</span>
            </label>
            <input
              {...register("contactPhone")}
              type="tel"
              className="input input-bordered w-full"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <textarea
              {...register("address")}
              className="textarea textarea-bordered w-full"
              placeholder="Enter address"
              rows={2}
            />
          </div>

          {/* Current User Info Display */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-base-content/70 mb-2">
              Current User Info:
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">ID:</span> {user.customerID}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">Verified:</span>{" "}
                {user.isVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              type="submit"
              className={`btn btn-primary ${
                isSubmitting || isUploading || isUpdating ? "loading" : ""
              }`}
              disabled={isSubmitting || isUploading || isUpdating}
            >
              {isSubmitting || isUploading || isUpdating
                ? "Updating..."
                : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                handleModalClose();
                (
                  document.getElementById("profile_modal") as HTMLDialogElement
                )?.close();
              }}
              disabled={isSubmitting || isUploading || isUpdating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={handleModalClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default UpdateUserProfile;
