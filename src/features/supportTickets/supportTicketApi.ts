import type { RootState } from "../../app/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";
export interface SupportTicket {
  ticketID: number;
  customerID: number;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketRequest {
  customerID: number;
  subject: string;
  description: string;
}

export interface UpdateTicketStatusRequest {
  ticketID: number;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
}

export const supportTicketApi = createApi({
  reducerPath: "supportTicketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if available
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["SupportTicket"],
  endpoints: (builder) => ({
    // Create a new support ticket
    createSupportTicket: builder.mutation<
      SupportTicket,
      CreateSupportTicketRequest
    >({
      query: (ticketData) => ({
        url: "/ticket/register",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["SupportTicket"],
    }),

    // Get all support tickets
    getAllSupportTickets: builder.query<SupportTicket[], void>({
      query: () => "/tickets",
      providesTags: ["SupportTicket"],
    }),

    // Get support ticket by ID
    getSupportTicketById: builder.query<SupportTicket, number>({
      query: (id) => `/ticket/${id}`,
      providesTags: (result, error, id) => [{ type: "SupportTicket", id }],
    }),

    // Get tickets by customer ID
    getTicketsByCustomer: builder.query<SupportTicket[], number>({
      query: (customerID) => `/customer/${customerID}/ticket`,
      providesTags: (result, error, customerID) => [
        { type: "SupportTicket", id: `customer-${customerID}` },
      ],
    }),

    // Get tickets by status (admin only)
    getTicketsByStatus: builder.query<SupportTicket[], string>({
      query: (status) => `/ticket/status/${status}`,
      providesTags: (result, error, status) => [
        { type: "SupportTicket", id: `status-${status}` },
      ],
    }),

    // Update ticket status
    updateSupportTicketStatus: builder.mutation<
      SupportTicket,
      UpdateTicketStatusRequest
    >({
      query: ({ ticketID, status }) => ({
        url: `/ticket/${ticketID}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { ticketID }) => [
        { type: "SupportTicket", id: ticketID },
        "SupportTicket",
      ],
    }),

    // Delete support ticket
    deleteSupportTicket: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/ticket/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SupportTicket", id },
        "SupportTicket",
      ],
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useGetAllSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useGetTicketsByCustomerQuery,
  useGetTicketsByStatusQuery,
  useUpdateSupportTicketStatusMutation,
  useDeleteSupportTicketMutation,
} = supportTicketApi;
