import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  TVenue,
  TCreateVenue,
  TUpdateVenue,
} from "../../dashboard/AdminDashboard/Types/venues";

export const venuesApi = createApi({
  reducerPath: "venuesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000", // Update if different
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Venues"],
  endpoints: (builder) => ({
    // Get all venues
    getVenues: builder.query<TVenue[], void>({
      query: () => "/venues",
      providesTags: ["Venues"],
    }),

    // Get a single venue by ID
    getVenueById: builder.query<TVenue, number>({
      query: (id) => `/venue/${id}`,
      providesTags: (result, error, id) => [{ type: "Venues", id }],
    }),

    // Create venue
    createVenue: builder.mutation<TVenue, TCreateVenue>({
      query: (newVenue) => ({
        url: "/venue/register",
        method: "POST",
        body: newVenue,
      }),
      invalidatesTags: ["Venues"],
    }),

    // Update venue
    updateVenue: builder.mutation<TVenue, TUpdateVenue>({
      query: ({ venueID, ...body }) => ({
        url: `/venue/${venueID}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Venues"],
    }),

    // Delete venue
    deleteVenue: builder.mutation<{ message: string }, number>({
      query: (venueID) => ({
        url: `/venue/${venueID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Venues"],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venuesApi;
