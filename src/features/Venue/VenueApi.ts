import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TVenue = {
  venueID: number;
  venueName: string;
  address: string;
  description?: string;
  capacity: number;
  imageUrl?: string | null;
};

export const venuesApi = createApi({
  reducerPath: "venuesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Venues"],
  endpoints: (builder) => ({
    // Register a new venue (admin only)
    registerVenue: builder.mutation<TVenue, Partial<TVenue>>({
      query: (newVenue) => ({
        url: "/venue/register",
        method: "POST",
        body: newVenue,
      }),
      invalidatesTags: ["Venues"],
    }),

    // Get all venues
    getVenues: builder.query<{ data: TVenue[] }, void>({
      query: () => "/venues",
      providesTags: ["Venues"],
    }),

    // Get venue by ID
    getVenueById: builder.query<TVenue, number>({
      query: (id) => `/venue/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Venues", id }],
    }),

    // // Get venue with events
    // getVenueWithEvents: builder.query<TVenue & { events: any[] }, number>({
    //   query: (id) => `/venues-event/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Venues", id }],
    // }),

    // Update venue by ID (admin only)
    updateVenue: builder.mutation<
      TVenue,
      Partial<TVenue> & { venueID: number }
    >({
      query: ({ venueID, ...patch }) => ({
        url: `/venue/${venueID}`,
        method: "PUT",
        body: patch, // No need for special handling now
      }),
      invalidatesTags: ["Venues"],
    }),

    // Delete venue by ID (admin only)
    deleteVenue: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/venue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Venues"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterVenueMutation,
  useGetVenuesQuery,
  useGetVenueByIdQuery,
  // useGetVenueWithEventsQuery,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venuesApi;
