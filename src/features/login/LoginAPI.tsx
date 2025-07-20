import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomains } from "../../utils/ApiDomain";

export type TLoginResponse = {
  token: string;
  user: {
    user_id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
  };
};
type LoginInputs = {
  email: string;
  password: string;
};
export const LoginAPI = createApi({
  reducerPath: "loginAPI",
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomains }),
  tagTypes: ["login"],
  endpoints: (builder) => ({
    loginUser: builder.mutation<TLoginResponse, LoginInputs>({
      query: (LoginData) => ({
        url: "/auth/login",
        method: "POST",
        body: LoginData,
      }),
      invalidatesTags: ["login"],
    }),
  }),
});
