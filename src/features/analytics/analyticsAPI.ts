// features/analytics/analyticsAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { ApiDomains } from "../../utils/ApiDomain";

export interface TIAnalytics {
  kpis: {
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    totalCustomers: number;
  };
  ticketsPerEvent: Array<{
    eventName: string;
    eventID: number;
    ticketsSold: number;
    venue: string;
  }>;
  revenueDistribution: Array<{
    eventName: string;
    revenue: number;
    percentage: number;
  }>;
  bookingsOverTime: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  paymentStatusBreakdown: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    totalBookings: number;
    totalSpent: number;
  }>;
}

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getAnalytics: builder.query<{ success: boolean; data: TIAnalytics }, void>({
      query: () => "/analytics",
      providesTags: ["Analytics"],
    }),
    getAnalyticsWithDateRange: builder.query<
      { success: boolean; data: TIAnalytics },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) =>
        `/analytics/range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetAnalyticsWithDateRangeQuery } =
  analyticsApi;
