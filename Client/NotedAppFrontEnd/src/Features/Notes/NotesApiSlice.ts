import { EntityAdapter, EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { Note } from "../../types";
import { BaseQueryFn, EndpointBuilder } from "@reduxjs/toolkit/query/react";

const notesAdaptor: EntityAdapter<Note, string> = createEntityAdapter<Note>({
  sortComparer: (a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1
});
const initialState: EntityState<Note, string> = notesAdaptor.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getNotes: builder.query<EntityState<Note, string>, void>({
          query: () => '/note',
          keepUnusedDataFor: 5,
          transformResponse: (responseData: Note[]) => {
            const loadedNotes = (responseData ?? []).map((note: Note) => {
                note.id = note._id
                return note
            });
            return notesAdaptor.setAll(initialState, loadedNotes)
          },
          providesTags: (result: EntityState<Note, string> | undefined) => {
              if (result?.ids) {
                  return [
                      { type: 'Note', id: 'LIST' },
                      ...result.ids.map((id: any) => ({ type: 'Note', id }))
                  ]
              } else return [{ type: 'Note', id: 'LIST' }]
          }
      }),
    addNewNote: builder.mutation<Note, Partial<Note>>({
      query: (newNotes) => ({
        url: '/note',
        method: 'POST',
        body: { ...newNotes }, // send the new note data
      })
    }),
    updateNote: builder.mutation<Note, {id: string, text: string, title: string, completed: boolean}>({
      query: ({id, text, title, completed}) => ({
        url: `/note`, // specify the note id to update
        method: 'PATCH',
        body: { id, text, title, completed }, // send the updated fields
      }),
      invalidatesTags: (_1, _2, args) => [{ type: 'Note', id: args.id }]
    }),
    deleteNote: builder.mutation<string, { id: string }>({
      query: ({ id }) => ({
        url: `/note`, // specify the note id to delete
        method: "DELETE",
        body: { id }, // send the id of the note to be deleted
      }),
      invalidatesTags: (_1, _2, args) => [{ type: 'Note', id: args.id }]
    })
  }),
})

export const { 
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
 } = notesApiSlice;

// returns query result object. Object with endpoint, data, error, isLoading, isSuccess, isError etc.
export const selectNotesResult =  notesApiSlice.endpoints.getNotes.select();


// this will return on the data
// we pass all functions to it that derive parts of redux what all we need. and last function computes using that data. 
export const selectedNotesData = createSelector([selectNotesResult], (notesResult) => {
  return notesResult?.data;
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
  // Pass in a selector that returns the users slice of state
} = notesAdaptor.getSelectors((state: any) => selectedNotesData(state) ?? initialState)