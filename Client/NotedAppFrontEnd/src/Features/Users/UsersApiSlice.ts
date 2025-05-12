import { EntityAdapter, EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { User } from "../../types";
import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query/react";

const userAdaptor: EntityAdapter<User, string> = createEntityAdapter<User>({});
const initialState: EntityState<User, string> = userAdaptor.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
        query: () => '/user',
        keepUnusedDataFor: 5,
        transformResponse: (responseData: User[]) => {
          const loadedUsers = responseData.map((user: User) => {
              user.id = user._id
              return user
          });
          return userAdaptor.setAll(initialState, loadedUsers)
        },
        providesTags: (result: EntityState<User, string> | undefined) => {
            if (result?.ids) {
                return [
                    { type: 'User', id: 'LIST' },
                    ...result.ids.map((id: any) => ({ type: 'User', id }))
                ]
            } else return [{ type: 'User', id: 'LIST' }]
        }
    }),
    addNewUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
          url: '/user',
          method: 'POST',
          body: { ...newUser },
      }),
      // Optimistically update the cache
      invalidatesTags: (res) => [{ type: 'User', id: res ? res.id : 'LIST' }],
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
          url: `/user`,
          method: 'PATCH',
          body: { ...newUser },
      }),
      // Optimistically update the cache
      invalidatesTags: (_1, _2, args: Partial<User>) => [{ type: 'User', id: args.id }],
    }),
    deleteUser: builder.mutation<string, { id: string } >({
      query: ({ id }) => ({
        url: `/user`,
        method: "DELETE",
        body: { id }, // send the id of the user to be deleted
      }),
      // Optimistically update the cache
      invalidatesTags: (_1, _2, args: Partial<User>) => [{ type: 'User', id: args.id }],
    })
    
  }),
})

export const { 
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice;

// returns query result object. Object with endpoint, data, error, isLoading, isSuccess, isError etc.
export const selectUsersResult =  usersApiSlice.endpoints.getUsers.select();


// this will return on the data
// we pass all functions to it that derive parts of redux what all we need. and last function computes using that data. 
export const selectedUsersData = createSelector([selectUsersResult], (userResult) => {
  return userResult?.data;
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
  // Pass in a selector that returns the users slice of state
} = userAdaptor.getSelectors((state: any) => selectedUsersData(state) ?? initialState)