import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../Features/Auth/AuthSlice";

const prepareHeaders = (headers: Headers, { getState }: any) => {
  headers.set('Content-Type', 'application/json');
  const token = getState().auth.token;

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: "include",
  prepareHeaders: prepareHeaders
});


const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    // send refresh token to get new access token 
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {

        // store the new token 
        api.dispatch(setCredentials({ ...refreshResult.data }))

        // retry original query with new access token
        result = await baseQuery(args, api, extraOptions)
    } else {

        if (refreshResult?.error?.status === 403) {
            (refreshResult.error as any).data.message = "Your login has expired. "
        }
        return refreshResult
    }
}

return result
}
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: (_) => ({})
})

