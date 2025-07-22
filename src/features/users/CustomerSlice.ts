import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  verificationCode?: string;
}

// State type
interface CustomerState {
  data: TCustomer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: CustomerState = {
  data: [],
  status: "idle",
  error: null,
};

//
// ─── ASYNC THUNKS ────────────────────────────────────────────────────────────────
//

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async () => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data.data;
  }
);

// Fetch single customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id: number) => {
    const response = await axios.get(`${API_URL}/customer/${id}`);
    return [response.data.data]; // wrap in array to match state.data
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number) => {
    await axios.delete(`${API_URL}/customer/${id}`);
    return id; // return ID to remove it from state
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (updatedCustomer: TCustomer) => {
    const response = await axios.put(
      `${API_URL}/customer/${updatedCustomer.customerID}`,
      updatedCustomer
    );
    return response.data.data;
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
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch customers";
      })

      // FETCH BY ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch customer";
      })

      // DELETE
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.customerID !== action.payload);
      })

      // UPDATE
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (c) => c.customerID === action.payload.customerID
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export const { clearCustomers } = CustomerSlice.actions;
export default CustomerSlice.reducer;
