import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type PaymentMethod = "M-Pesa" | "Stripe" | "Card";
export type PaymentStatus = "Pending" | "Completed" | "Failed" | "Refunded"; // Match your schema enum

export type TIPayment = {
  paymentID: number;
  customerID: number;
  bookingID: number;
  amount: string;
  paymentMethod: PaymentMethod;
  transactionID?: string;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TICreatePayment = {
  customerID: number;
  bookingID: number;
  amount: string;
  paymentMethod: PaymentMethod;
  transactionID?: string;
  paymentStatus?: PaymentStatus;
};

// Response types to match your backend
export type PaymentResponse = {
  success: boolean;
  message: string;
  data: TIPayment;
};

export type BookingResponse = {
  success?: boolean;
  message?: string;
  data?: TIPayment;
  // Alternative response structure
  bookingID?: number;
  customerID?: number;
  eventID?: number;
  numberOfTickets?: number;
  totalAmount?: string;
  bookingDate?: string;
  bookingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TMpesaStkRequest = {
  phoneNumber: string;
  amount: number;
  paymentID: number;
};

export type TMpesaStkResponse = {
  success: boolean;
  data?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
  message?: string;
};

export const paymentApi = createApi({
  reducerPath: "paymentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    // Create a new payment record
    createPayment: builder.mutation<PaymentResponse, TICreatePayment>({
      query: (newPayment) => ({
        url: "/payment/register",
        method: "POST",
        body: newPayment,
      }),
      invalidatesTags: ["Payments"],
    }),

    // Get all payments (admin)
    getAllPayments: builder.query<
      { success: boolean; data: TIPayment[] },
      void
    >({
      query: () => "/payments",
      providesTags: ["Payments"],
    }),

    // Get payment by ID
    getPaymentById: builder.query<
      { success: boolean; data: TIPayment },
      number
    >({
      query: (id) => `/payment/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payments", id }],
    }),

    // Get payments by customer ID
    getPaymentsByCustomerId: builder.query<{ data: TIPayment[] }, number>({
      query: (customerID) => `/payment/customer/${customerID}`,
      providesTags: (_result, _error, customerID) => [
        { type: "Payments", id: `customer-${customerID}` },
      ],
    }),

    // Update payment
    updatePayment: builder.mutation<
      { data: TIPayment },
      Partial<TIPayment> & { id: number }
    >({
      query: (updatedPayment) => ({
        url: `/payment/${updatedPayment.id}`,
        method: "PUT",
        body: updatedPayment,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Payments",
        { type: "Payments", id },
      ],
    }),

    // Delete payment (admin)
    deletePayment: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Payments",
        { type: "Payments", id },
      ],
    }),

    // M-Pesa STK Push
    initiateMpesaPayment: builder.mutation<TMpesaStkResponse, TMpesaStkRequest>(
      {
        query: (stkData) => ({
          url: "/api/mpesa/stk-push",

          method: "POST",
          body: stkData,
        }),
        invalidatesTags: ["Payments"],
      }
    ),
  }),
});

// Export hooks
export const {
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByCustomerIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useInitiateMpesaPaymentMutation,
} = paymentApi;
