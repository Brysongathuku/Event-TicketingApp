import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userAPI } from "../../../features/users/usersApi";
import type { TUser } from "../../../features/users/usersApi";
import { toast } from "sonner";
import { useEffect } from "react";

type UpdateUserProfileProps = {
  user: TUser | null;
  refetch: () => void;
};

type UpdateProfileInputs = {
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  address: string;
  isVerified: boolean;
};

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
    .email("Invalid email format")
    .required("Email is required"),
  contactPhone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  isVerified: yup.boolean().required("Verification status is required"),
});

const UpdateUserProfile = ({ user, refetch }: UpdateUserProfileProps) => {
  const [updateUser, { isLoading }] = userAPI.useUpdateUserMutation({
    fixedCacheKey: "updateUserProfile",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactPhone: "",
      address: "",
      isVerified: false,
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.email || "");
      setValue("contactPhone", user.contactPhone || "");
      setValue("address", user.address || "");
      setValue("isVerified", user.isVerified || false);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    try {
      if (!user) {
        toast.error("No user selected for profile update.");
        return;
      }

      console.log("User object:", user); // Debug log to see the user object
      console.log("customer id:", user.customerID); // Debug log to see the ID

      await updateUser({
        id: user.customerID, // Use customerID instead of id
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactPhone: data.contactPhone,
        address: data.address,
        isVerified: data.isVerified,
      });
      toast.success("Profile updated successfully!");
      refetch();
      reset();
      (document.getElementById("profile_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <dialog id="profile_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-2xl mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">
          Update Profile for {user?.firstName} {user?.lastName}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-1 block">
                First Name:
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="input input-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <span className="text-sm text-red-400 mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div>
              <label className="text-white font-semibold mb-1 block">
                Last Name:
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="input input-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <span className="text-sm text-red-400 mt-1">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-white font-semibold mb-1 block">
              Email:
            </label>
            <input
              {...register("email")}
              type="email"
              className="input input-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="text-sm text-red-400 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-white font-semibold mb-1 block">
              Phone Number:
            </label>
            <input
              {...register("contactPhone")}
              type="tel"
              className="input input-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
              placeholder="Enter phone number"
            />
            {errors.contactPhone && (
              <span className="text-sm text-red-400 mt-1">
                {errors.contactPhone.message}
              </span>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-white font-semibold mb-1 block">
              Address:
            </label>
            <textarea
              {...register("address")}
              className="textarea textarea-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
              placeholder="Enter full address"
              rows={3}
            />
            {errors.address && (
              <span className="text-sm text-red-400 mt-1">
                {errors.address.message}
              </span>
            )}
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3">
            <label className="text-white font-semibold">
              Verification Status:
            </label>
            <div className="form-control">
              <label className="label cursor-pointer flex items-center gap-2">
                <input
                  {...register("isVerified")}
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text text-white">Verified User</span>
              </label>
            </div>
          </div>

          <div className="modal-action flex flex-col sm:flex-row gap-2 mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-primary" />{" "}
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              className="btn w-full sm:w-auto"
              type="button"
              onClick={() => {
                (
                  document.getElementById("profile_modal") as HTMLDialogElement
                )?.close();
                reset();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateUserProfile;
