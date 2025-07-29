import { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { uploadImage } from "../../../utils/cloudinaryService";
import { userAPI } from "../../../features/users/usersApi";
import type { TUser } from "../../../features/users/usersApi";
import type { RootState } from "../../../app/store";
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
  contactPhone: yup.string().default(""),
  address: yup.string().default(""),
  imageUrl: yup.string().url("Please enter a valid URL").default(""),
});

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
  modalId?: string; // Allow custom modal ID
}

const UpdateUserProfile = ({
  user,
  refetch,
  modalId = "profile_modal",
}: UpdateUserProfileProps) => {
  // Get current logged-in user from Redux store
  const currentUserState = useSelector((state: RootState) => state.user);
  const currentUser = currentUserState?.user;

  // Determine context based on Redux state
  const currentUserRole = currentUser?.role || "user";
  const isOwnProfile =
    user?.customerID === currentUser?.user_id ||
    user?.customerID === currentUser?.user_id ||
    user?.customerID === currentUser?.user_id;

  // Use different mutations based on context
  const [updateUser, { isLoading: isUpdatingUser }] =
    userAPI.useUpdateUserMutation();
  // Add this line if you have a separate endpoint for users updating their own profile
  // const [updateOwnProfile, { isLoading: isUpdatingOwnProfile }] = userAPI.useUpdateOwnProfileMutation();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which mutation and loading state to use
  const isUpdating = isUpdatingUser; // || isUpdatingOwnProfile if separate endpoint exists

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
        contactPhone: user.contactPhone || "",
        address: user.address || "",
        imageUrl: user.imageUrl || "",
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

      // Prepare update data based on context
      const updateData = {
        // Use appropriate ID field based on context
        id: isOwnProfile
          ? currentUser?.user_id || user.customerID || user.customerID
          : user.customerID || user.customerID || user.customerID,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactPhone: data.contactPhone,
        address: data.address,
        imageUrl: imageUrl || "",
      };

      // Use appropriate mutation based on context
      if (isOwnProfile && currentUserRole !== "admin") {
        // If you have a separate endpoint for users updating their own profile
        // await updateOwnProfile(updateData).unwrap();
        // For now, using the same endpoint
        await updateUser(updateData).unwrap();
      } else {
        // Admin updating any user or admin updating their own profile
        await updateUser(updateData).unwrap();
      }

      toast.dismiss();
      toast.success("Profile updated successfully!");

      // Refetch data to update the UI
      if (refetch) {
        refetch();
      }

      // Close modal
      (document.getElementById(modalId) as HTMLDialogElement)?.close();
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
        contactPhone: user.contactPhone || "",
        address: user.address || "",
        imageUrl: user.imageUrl || "",
      });
      setPreviewImage(user.imageUrl || null);
      setSelectedFile(null);
    }
  };

  if (!user) return null;

  // Determine if certain fields should be editable based on role and context
  const canEditEmail = currentUserRole === "admin" || isOwnProfile;
  const showAdminInfo = currentUserRole === "admin";

  return (
    <dialog id={modalId} className="modal">
      {/* Enhanced modal backdrop with blur */}
      <div
        className="modal-backdrop fixed inset-0 z-40"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)",
          backdropFilter: "blur(8px)",
        }}
      />

      <div
        className="modal-box max-w-2xl relative z-50 border-0 shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
          borderRadius: "20px",
        }}
      >
        {/* Enhanced Header */}
        <div
          className="flex items-center gap-4 mb-8 p-6 -mx-6 -mt-6 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)",
            color: "white",
          }}
        >
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <FaEdit className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-2xl text-white">
              {isOwnProfile ? "Update My Profile" : "Update User Profile"}
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Manage profile information and settings
            </p>
          </div>
          {/* Enhanced user context info */}
          {currentUserRole === "admin" && !isOwnProfile && (
            <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-white text-sm font-medium">Admin View</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Enhanced Profile Image Section */}
          <div
            className="text-center p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              border: "1px solid #cbd5e1",
            }}
          >
            <label className="block text-lg font-semibold mb-4 text-gray-800">
              Profile Picture
            </label>

            <div className="flex flex-col items-center gap-6">
              {/* Enhanced Image Preview */}
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-white"
                  style={{
                    background: previewImage
                      ? "transparent"
                      : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                  }}
                >
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
                    <FaUser className="text-gray-500 text-4xl" />
                  )}
                </div>

                {previewImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Enhanced Upload Controls */}
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isUpdating}
                >
                  <FaUpload className="text-sm" />
                  {previewImage ? "Change Image" : "Upload Image"}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Form Fields */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register("firstName")}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      errors.firstName
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 bg-white focus:border-blue-500"
                    } focus:outline-none focus:ring-0`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <span className="text-red-600 text-sm mt-1 block font-medium">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register("lastName")}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      errors.lastName
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 bg-white focus:border-blue-500"
                    } focus:outline-none focus:ring-0`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className="text-red-600 text-sm mt-1 block font-medium">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #fefefe 0%, #f8fafc 100%)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : !canEditEmail
                        ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                        : "border-gray-200 bg-white focus:border-blue-500"
                    } focus:outline-none focus:ring-0`}
                    placeholder="Enter email address"
                    disabled={!canEditEmail}
                  />
                  {errors.email && (
                    <span className="text-red-600 text-sm mt-1 block font-medium">
                      {errors.email.message}
                    </span>
                  )}
                  {!canEditEmail && (
                    <span className="text-blue-600 text-sm mt-1 block">
                      Email cannot be changed
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register("contactPhone")}
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    {...register("address")}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-all duration-200 resize-none"
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Admin Info Display */}
            {showAdminInfo && (
              <div
                className="p-6 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid #93c5fd",
                }}
              >
                <h4 className="font-semibold text-lg text-blue-900 mb-4">
                  User Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">ID:</span>
                    <p className="text-gray-700 mt-1">
                      {user.customerID || user.customerID || user.customerID}
                    </p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Role:</span>
                    <p className="text-gray-700 mt-1 capitalize">{user.role}</p>
                  </div>
                  {user.isVerified !== undefined && (
                    <div className="bg-white/50 p-3 rounded-lg">
                      <span className="font-medium text-blue-800">
                        Verified:
                      </span>
                      <p
                        className={`mt-1 font-medium ${
                          user.isVerified ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Modal Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
              onClick={() => {
                handleModalClose();
                (
                  document.getElementById(modalId) as HTMLDialogElement
                )?.close();
              }}
              disabled={isSubmitting || isUploading || isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 ${
                isSubmitting || isUploading || isUpdating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl"
              }`}
              disabled={isSubmitting || isUploading || isUpdating}
            >
              {isSubmitting || isUploading || isUpdating
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={handleModalClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default UpdateUserProfile;
