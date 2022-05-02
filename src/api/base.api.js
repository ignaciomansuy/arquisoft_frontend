import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "localhost:80" }),
  endpoints: () => ({}),
  tagTypes: ['session', 'map'],
});

export default baseApi;
