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
    // preparing headers
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
    // Fetch a single event by ID/.  when doing   user dashboardsto
  }),
});
