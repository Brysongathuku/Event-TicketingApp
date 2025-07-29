import { useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  type TIBooking,
} from "../../../features/Bookings/bookingAPI";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTicketAlt,
  FaTrash,
  FaEye,
  FaDownload,
  FaSearch,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const FetchAllBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("bookingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBooking, setSelectedBooking] = useState<TIBooking | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // API hooks
  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useGetAllBookingsQuery();

  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const bookings = bookingsData?.data || [];

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingID.toString().includes(searchTerm) ||
      booking.customerID.toString().includes(searchTerm) ||
      booking.eventID.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || booking.bookingStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });
  // .sort((a, b) => {
  //   let aValue: string | number | Date | undefined =
  //     a[sortBy as keyof TIBooking];
  //   let bValue: string | number | Date | undefined =
  //     b[sortBy as keyof TIBooking];

  //   // Handle date sorting
  //   if (
  //     sortBy === "bookingDate" ||
  //     sortBy === "createdAt" ||
  //     sortBy === "updatedAt"
  //   ) {
  //     aValue = new Date(aValue ?? 0).getTime();
  //     bValue = new Date(bValue ?? 0).getTime();
  //   }

  //   // Handle numeric sorting
  //   if (sortBy === "totalAmount") {
  //     aValue = parseFloat(aValue !== undefined ? String(aValue) : "0");
  //     bValue = parseFloat(bValue !== undefined ? String(bValue) : "0");
  //   }

  //   if (sortOrder === "asc") {
  //     return aValue - bValue;
  //   } else {
  //     return bValue - aValue;
  //   }
  // });

  // Handle status update
  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await updateBooking({
        id: bookingId,
        bookingStatus:
          newStatus as import("../../../features/Bookings/bookingAPI").BookingStatus,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // Handle payment status update
  const handlePaymentUpdate = async (
    bookingId: number,
    newPaymentStatus: string
  ) => {
    try {
      await updateBooking({
        id: bookingId,
        bookingStatus:
          newPaymentStatus as import("../../../features/Bookings/bookingAPI").BookingStatus,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status");
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (bookingId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      try {
        await deleteBooking(bookingId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete booking:", error);
        alert("Failed to delete booking");
      }
    }
  };

  // Handle view details
  const handleViewDetails = (booking: TIBooking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
    const modal = document.getElementById(
      "booking_details_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  // Get status badge classes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "badge badge-success gap-1";
      case "pending":
        return "badge badge-warning gap-1";
      case "cancelled":
        return "badge badge-error gap-1";
      default:
        return "badge badge-neutral gap-1";
    }
  };

  // Get payment status badge classes
  const getPaymentBadge = (status?: string) => {
    switch (status) {
      case "paid":
        return "badge badge-success gap-1";
      case "pending":
        return "badge badge-warning gap-1";
      case "failed":
        return "badge badge-error gap-1";
      default:
        return "badge badge-neutral gap-1";
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "Customer ID",
      "Event ID",
      "Tickets",
      "Total Amount",
      "Booking Date",
      "Status",
      "Payment Status",
      "Created At",
    ];

    const csvData = filteredAndSortedBookings.map((booking) => [
      booking.bookingID,
      booking.customerID,
      booking.eventID,
      booking.numberOfTickets,
      booking.totalAmount,
      new Date(booking.bookingDate).toLocaleDateString(),
      booking.bookingStatus,
      booking.bookingStatus || "N/A",
      booking.createdAt
        ? new Date(booking.createdAt).toLocaleDateString()
        : "N/A",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <FaExclamationTriangle />
        <span>Error loading bookings. Please try again.</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Bookings</h1>
        <p className="text-gray-600">Manage and monitor all event bookings</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-64">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by Booking ID, Customer ID, Event ID..."
              className="bg-transparent outline-none flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              className="select select-sm bg-gray-100 border-gray-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="select select-sm bg-gray-100 border-gray-300"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              className="select select-sm bg-gray-100 border-gray-300"
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("_");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <option value="bookingDate_desc">Latest First</option>
              <option value="bookingDate_asc">Oldest First</option>
              <option value="totalAmount_desc">Highest Amount</option>
              <option value="totalAmount_asc">Lowest Amount</option>
              <option value="bookingID_desc">Booking ID (High-Low)</option>
              <option value="bookingID_asc">Booking ID (Low-High)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-green-100 hover:bg-green-200 text-green-700 gap-2"
              onClick={exportToCSV}
            >
              <FaDownload size={12} />
              Export CSV
            </button>
            <button
              className="btn btn-sm bg-blue-100 hover:bg-blue-200 text-blue-700 gap-2"
              onClick={() => refetch()}
            >
              <FaSync size={12} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 text-2xl font-bold">
              {bookings.length}
            </div>
            <div className="text-blue-700 text-sm">Total Bookings</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 text-2xl font-bold">
              {bookings.filter((b) => b.bookingStatus === "confirmed").length}
            </div>
            <div className="text-green-700 text-sm">Confirmed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-yellow-600 text-2xl font-bold">
              {bookings.filter((b) => b.bookingStatus === "pending").length}
            </div>
            <div className="text-yellow-700 text-sm">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 text-2xl font-bold">
              $
              {bookings
                .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0)
                .toFixed(2)}
            </div>
            <div className="text-green-700 text-sm">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-gray-700 font-semibold">Booking ID</th>
                <th className="text-gray-700 font-semibold">Customer</th>
                <th className="text-gray-700 font-semibold">Event</th>
                <th className="text-gray-700 font-semibold">Tickets</th>
                <th className="text-gray-700 font-semibold">Amount</th>
                <th className="text-gray-700 font-semibold">Date</th>
                <th className="text-gray-700 font-semibold">Status</th>
                <th className="text-gray-700 font-semibold">Payment</th>
                <th className="text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    <FaTicketAlt className="text-4xl mx-auto mb-2 opacity-50" />
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.bookingID} className="hover:bg-gray-50">
                    <td>
                      <div className="font-semibold text-blue-600">
                        #{booking.bookingID}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-purple-500" size={12} />
                        <span>Customer {booking.customerID}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500" size={12} />
                        <span>Event {booking.eventID}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-green-500" size={12} />
                        <span>{booking.numberOfTickets}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-green-600">
                        ${booking.totalAmount}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className={`${getStatusBadge(
                            booking.bookingStatus
                          )} cursor-pointer`}
                        >
                          {booking.bookingStatus === "confirmed" && (
                            <FaCheck size={10} />
                          )}
                          {booking.bookingStatus === "pending" && (
                            <FaClock size={10} />
                          )}
                          {booking.bookingStatus === "cancelled" && (
                            <FaTimes size={10} />
                          )}
                          {booking.bookingStatus}
                        </div>
                        <ul className="dropdown-content z-10 menu p-2 shadow bg-white rounded-box w-32">
                          <li>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  booking.bookingID,
                                  "confirmed"
                                )
                              }
                            >
                              Confirmed
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking.bookingID, "pending")
                              }
                            >
                              Pending
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  booking.bookingID,
                                  "cancelled"
                                )
                              }
                            >
                              Cancelled
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className={`${getPaymentBadge(
                            booking.bookingStatus
                          )} cursor-pointer`}
                        >
                          <MdPayment size={10} />
                          {booking.bookingStatus || "N/A"}
                        </div>
                        <ul className="dropdown-content z-10 menu p-2 shadow bg-white rounded-box w-24">
                          <li>
                            <button
                              onClick={() =>
                                handlePaymentUpdate(booking.bookingID, "paid")
                              }
                            >
                              Paid
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                handlePaymentUpdate(
                                  booking.bookingID,
                                  "pending"
                                )
                              }
                            >
                              Pending
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                handlePaymentUpdate(booking.bookingID, "failed")
                              }
                            >
                              Failed
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-xs bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <FaEye size={10} />
                        </button>
                        <button
                          className="btn btn-xs bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                          onClick={() => handleDeleteBooking(booking.bookingID)}
                          disabled={isDeleting}
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <dialog id="booking_details_modal" className="modal">
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                ✕
              </button>
            </form>

            <h3 className="font-bold text-xl mb-6">Booking Details</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-600">
                    Booking ID
                  </label>
                  <div className="text-lg font-bold text-blue-600">
                    #{selectedBooking.bookingID}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">
                    Customer ID
                  </label>
                  <div className="text-lg">{selectedBooking.customerID}</div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">
                    Event ID
                  </label>
                  <div className="text-lg">{selectedBooking.eventID}</div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">
                    Number of Tickets
                  </label>
                  <div className="text-lg font-semibold">
                    {selectedBooking.numberOfTickets}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-600">
                    Total Amount
                  </label>
                  <div className="text-lg font-bold text-green-600">
                    ${selectedBooking.totalAmount}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">
                    Booking Date
                  </label>
                  <div className="text-lg">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Status</label>
                  <div
                    className={getStatusBadge(selectedBooking.bookingStatus)}
                  >
                    {selectedBooking.bookingStatus}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">
                    Payment Status
                  </label>
                  <div
                    className={getPaymentBadge(selectedBooking.bookingStatus)}
                  >
                    {selectedBooking.bookingStatus || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {(selectedBooking.createdAt || selectedBooking.updatedAt) && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {selectedBooking.createdAt && (
                    <div>
                      <span className="font-semibold">Created: </span>
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </div>
                  )}
                  {selectedBooking.updatedAt && (
                    <div>
                      <span className="font-semibold">Updated: </span>
                      {new Date(selectedBooking.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsDetailsModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default FetchAllBookings;
