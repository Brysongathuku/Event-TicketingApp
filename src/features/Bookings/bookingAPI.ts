import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type TIBooking = {
  bookingID: number;
  customerID: number;
  eventID: number;
  numberOfTickets: number;
  totalAmount: string;
  bookingDate: string;
  bookingStatus: BookingStatus;

  createdAt?: string;
  updatedAt?: string;
};

export type TICreateBooking = Omit<
  TIBooking,
  "bookingID" | "createdAt" | "updatedAt"
>;

export const bookingApi = createApi({
  reducerPath: "bookingAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
    prepareHeaders: (Headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        Headers.set("authorization", `Bearer ${token}`);
      }
      Headers.set("content-type", "application/json");
      return Headers;
    },
  }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    // Create a new booking (user role required)
    createBooking: builder.mutation<TIBooking, TICreateBooking>({
      query: (newBooking) => ({
        url: "/booking/register",
        method: "POST",
        body: newBooking,
      }),
      invalidatesTags: ["Bookings"],
    }),

    // Get all bookings (admin role required)
    getAllBookings: builder.query<{ data: TIBooking[] }, void>({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),

    // Get a single booking by ID (admin role required)
    getBookingById: builder.query<{ data: TIBooking }, number>({
      query: (id) => `/booking/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Bookings", id }],
    }),

    // Get bookings by customer ID (user role required)
    getBookingsByCustomerId: builder.query<{ data: TIBooking[] }, number>({
      query: (customerID) => `/bookings/customer/${customerID}`,
      providesTags: (_result, _error, customerID) => [
        { type: "Bookings", id: `customer-${customerID}` },
      ],
    }),

    // Update a booking (both admin and user roles allowed)
    updateBooking: builder.mutation<
      TIBooking,
      Partial<TIBooking> & { id: number }
    >({
      query: (updatedBooking) => ({
        url: `/booking/${updatedBooking.id}`,
        method: "PUT",
        body: updatedBooking,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Bookings",
        { type: "Bookings", id },
      ],
    }),

    // Delete a booking (admin role required)
    deleteBooking: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Bookings",
        { type: "Bookings", id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateBookingMutation,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingsByCustomerIdQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
