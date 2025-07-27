import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8081";

// Customer type definition
export interface TCustomer {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id: number;
  contactPhone: string;
  address: string;
  role: "user" | "admin";
  isVerified: boolean;
  imageUrl: string;
  verificationCode?: string;
}

// Update customer payload type (only the fields that can be updated)
export interface UpdateCustomerPayload {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone?: string;
  address?: string;
  imageUrl?: string;
}

// API Error Response type
interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

// API Success Response type
interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// State type
interface CustomerState {
  data: TCustomer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  updateError: string | null;
}

// Initial state
const initialState: CustomerState = {
  data: [],
  status: "idle",
  updateStatus: "idle",
  error: null,
  updateError: null,
};

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

//
// ─── ASYNC THUNKS ────────────────────────────────────────────────────────────────
//

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiSuccessResponse<TCustomer[]>>(
        `${API_URL}/customers`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch single customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiSuccessResponse<TCustomer>>(
        `${API_URL}/customer/${id}`
      );
      return [response.data.data]; // wrap in array to match state.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/customer/${id}`);
      return id; // return ID to remove it from state
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update customer - Enhanced version
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (updateData: UpdateCustomerPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiSuccessResponse<TCustomer>>(
        `${API_URL}/customer/${updateData.customerID}`,
        {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          contactPhone: updateData.contactPhone || "",
          address: updateData.address || "",
          imageUrl: updateData.imageUrl || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Update customer error:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.code === "ECONNABORTED") {
          return rejectWithValue("Request timeout. Please try again.");
        }

        if (axiosError.response?.status === 404) {
          return rejectWithValue("Customer not found.");
        }

        if (axiosError.response?.status === 400) {
          return rejectWithValue(
            axiosError.response.data?.message || "Invalid data provided."
          );
        }

        if (axiosError.response?.status === 409) {
          return rejectWithValue("Email already exists.");
        }

        return rejectWithValue(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to update customer profile"
        );
      }

      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update customer role (separate action for role updates)
export const updateCustomerRole = createAsyncThunk(
  "customers/updateRole",
  async (
    { customerID, role }: { customerID: number; role: "user" | "admin" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch<ApiSuccessResponse<TCustomer>>(
        `${API_URL}/customer/${customerID}/role`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

//
// ─── SLICE ───────────────────────────────────────────────────────────────────────
//

export const CustomerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomers: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
    clearUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch customers";
      })

      // FETCH BY ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch customer";
      })

      // DELETE
      .addCase(deleteCustomer.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.customerID !== action.payload);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete customer";
      })

      // UPDATE CUSTOMER
      .addCase(updateCustomer.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.data.findIndex(
          (c) => c.customerID === action.payload.customerID
        );
        if (index !== -1) {
          // Merge the updated data with existing data to preserve fields not being updated
          state.data[index] = {
            ...state.data[index],
            ...action.payload,
          };
        }
        state.updateError = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || "Failed to update customer";
      })

      // UPDATE CUSTOMER ROLE
      .addCase(updateCustomerRole.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCustomerRole.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.data.findIndex(
          (c) => c.customerID === action.payload.customerID
        );
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...action.payload,
          };
        }
        state.updateError = null;
      })
      .addCase(updateCustomerRole.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || "Failed to update customer role";
      });
  },
});

export const { clearCustomers, clearUpdateStatus, resetErrors } =
  CustomerSlice.actions;
export default CustomerSlice.reducer;
