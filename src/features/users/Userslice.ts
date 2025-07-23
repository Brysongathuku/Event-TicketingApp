import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  token: string | null;

  user: {
    user_id: number;
    firstName: string;
    role: "admin" | "user";
    lastName: string;
    email: string;
    password: string;
    contactPhone: string;
  } | null;
};
const initialState: UserState = {
  token: null,
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});
export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
