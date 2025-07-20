import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  fetchCustomerById,
  clearCustomers,
} from "../../../features/users/CustomerSlice";
import type { RootState, AppDispatch } from "../../../app/store";
import type { TCustomer } from "../../../features/users/CustomerSlice";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const FetchUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: users,
    status,
    error,
  } = useSelector((state: RootState) => state.customers);
  const [searchId, setSearchId] = useState("");

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
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Car System Users{" "}
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
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {user.firstName} {user.lastName}
                </h2>

                <p>
                  <strong>ID:</strong> {user.customerID}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber || "N/A"}
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
                <div className="flex flex-row gap-2 mt-3">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-400 hover:bg-red-600 text-white transition duration-200 shadow-sm"
                    title="Delete"
                  >
                    <MdDelete className="text-lg" />
                    <span className="hidden ">Delete</span>
                  </button>

                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-200 hover:bg-yellow-600 text-white transition duration-200 shadow-sm"
                    title="Edit"
                  >
                    <FaEdit className="text-lg" />
                    <span className="hidden sm:inline">Edit</span>
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
