import baseApi from './base.api';

const Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSession: build.query({
      query: () => '/session/home',
      providesTags: [{ type: 'session' }],
    }),
    createResource: build.mutation({
      query: (body) => ({
        url: '/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) => (result ? [{ type: 'Example', id: 'LIST' }] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetResourcesQuery, useCreateResourceMutation } = Api;
