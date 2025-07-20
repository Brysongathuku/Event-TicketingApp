import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";

export type TUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  isVerified: string;
};
export type TverifyUser = {
  email: string;
  code: string;
};

export const userAPI = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomains,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    createUSers: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: "/auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["users"],
    }),
    //verify  users
    VerifyUser: builder.mutation<{ Message: string }, TverifyUser>({
      query: (data) => ({
        url: "auth/verify",
        method: "POST",
        body: data,
      }),
    }),
    getUsers: builder.query<{ data: TUser[] }, void>({
      query: () => "/users",
      providesTags: ["users"],
    }),
    //update user
    updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
      query: (updateUser) => ({
        url: `/user/${updateUser.id}`,
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: ["users"],
    }),
    getUserById: builder.query<TUser, number>({
      query: (id) => `/user/${id}`,
    }),
  }),
});
