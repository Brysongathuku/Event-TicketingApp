import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TIEvent = {
  eventID: number;
  title: string;
  eventDate: string;
  startTime: string;
  ticketPrice: string;
  availableTickets: number;
  totalTickets: number;
  venueID: number;
  imageUrl?: string | null;

  description?: string | null | undefined;
};

export const eventApi = createApi({
  reducerPath: "eventAPI",
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
  tagTypes: ["Events"],
  endpoints: (builder) => ({
    createEvents: builder.mutation<TIEvent, Partial<TIEvent>>({
      query: (newEvent) => ({
        url: "/event/register",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Events"],
    }),
    getEvents: builder.query<{ data: TIEvent[] }, void>({
      query: () => "/events",
      providesTags: ["Events"],
    }),
    // Add the getEventById endpoint
    getEventById: builder.query<{ data: TIEvent }, number>({
      query: (eventId) => `/event/${eventId}`,
      providesTags: (_result, _error, eventId) => [
        { type: "Events", id: eventId },
      ],
    }),
    updateEvent: builder.mutation<TIEvent, Partial<TIEvent> & { id: number }>({
      query: (updatedEvent) => ({
        url: `/event/${updatedEvent.id}`,
        method: "PUT",
        body: updatedEvent,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useCreateEventsMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
