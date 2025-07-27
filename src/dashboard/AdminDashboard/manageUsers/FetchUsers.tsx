import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  fetchCustomerById,
  clearCustomers,
} from "../../../features/users/CustomerSlice";
import type { RootState, AppDispatch } from "../../../app/store";
import type { TCustomer } from "../../../features/users/CustomerSlice";
import { FaUserCog, FaUserEdit, FaUser } from "react-icons/fa";
import ChangeRole from "./ChangeRole"; // Import your ChangeRole component
import UpdateUserProfile from "./UpdateUserProfile"; // Import your UpdateUserProfile component

const FetchUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: users,
    status,
    error,
  } = useSelector((state: RootState) => state.customers);
  const [searchId, setSearchId] = useState("");
  const [selectedUserForRole, setSelectedUserForRole] =
    useState<TCustomer | null>(null);
  const [selectedUserForProfile, setSelectedUserForProfile] =
    useState<TCustomer | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = Number(searchId.trim());
    if (!id) {
      alert("Please enter a valid numeric ID.");
      return;
    }
    dispatch(fetchCustomerById(id));
    setSearchId("");
  };

  const handleRefetchAll = () => {
    dispatch(clearCustomers());
    dispatch(fetchCustomers());
    setImageLoadErrors(new Set()); // Reset image errors when refetching
  };

  const handleChangeRole = (user: TCustomer) => {
    setSelectedUserForRole(user);
    (document.getElementById("role_modal") as HTMLDialogElement)?.showModal();
  };

  const handleUpdateProfile = (user: TCustomer) => {
    setSelectedUserForProfile(user);
    (
      document.getElementById("profile_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleImageError = (customerID: number) => {
    setImageLoadErrors((prev) => new Set(prev).add(customerID));
  };

  const getImageComponent = (user: TCustomer) => {
    const hasImageError = imageLoadErrors.has(user.customerID);
    const hasValidImageUrl = user.imageUrl && user.imageUrl.trim() !== "";

    if (!hasValidImageUrl || hasImageError) {
      // Show default avatar icon
      return (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          <FaUser className="text-gray-500 text-2xl" />
        </div>
      );
    }

    return (
      <img
        src={user.imageUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-16 h-16 object-cover rounded-full mb-3 border-2 border-gray-300"
        onError={() => handleImageError(user.customerID)}
        loading="lazy"
      />
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Eventix System Users{" "}
      </h1>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-wrap items-center gap-4"
      >
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter User ID"
          className="border border-gray-300 rounded px-4 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition duration-200"
        >
          Search by ID
        </button>
        <button
          type="button"
          onClick={handleRefetchAll}
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded transition duration-200"
        >
          Fetch All Users
        </button>
      </form>

      {/* Modals */}
      <ChangeRole user={selectedUserForRole} />
      <UpdateUserProfile user={selectedUserForProfile} />

      {status === "loading" && (
        <p className="text-blue-500 text-lg">Loading users...</p>
      )}
      {status === "failed" && (
        <p className="text-red-500 text-lg">Error: {error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {status === "succeeded" && users.length > 0
          ? users.map((user: TCustomer) => (
              <div
                key={user.customerID}
                className="bg-blue-300 border border-gray-200 rounded-lg shadow-md p-6 transition hover:shadow-lg"
              >
                {/* Profile Image */}
                <div className="flex justify-center">
                  {getImageComponent(user)}
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="space-y-1">
                  <p>
                    <strong>ID:</strong> {user.customerID}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.contactPhone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {user.address || "N/A"}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Verification Code:</strong>{" "}
                    {user.verificationCode || "N/A"}
                  </p>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white transition duration-200 shadow-sm"
                    title="Change Role"
                    onClick={() => handleChangeRole(user)}
                  >
                    <FaUserCog className="text-lg" />
                    <span className="hidden sm:inline">Change Role</span>
                  </button>

                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition duration-200 shadow-sm"
                    title="Update Profile"
                    onClick={() => handleUpdateProfile(user)}
                  >
                    <FaUserEdit className="text-lg" />
                    <span className="hidden sm:inline">Update Profile</span>
                  </button>
                </div>
              </div>
            ))
          : status === "succeeded" && (
              <p className="text-center text-gray-600 col-span-full">
                No users found.
              </p>
            )}
      </div>
    </div>
  );
};

export default FetchUsers;
