import { useGetNotesQuery } from "./NotesApiSlice"
import Note from "./Note";
import useAuth from "../../hooks/useAuth";

export const NotesList = () => {
  const { id, isAdmin, isManager} = useAuth();
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery(undefined, {
    pollingInterval: 10000, // Refresh every 60 seconds
    refetchOnFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true // Refetch when the browser reconnects
  });

  let content = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError) {
    const errorText = (error as any)?.data?.message;
    content = <p className={"errmsg"}>{errorText}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = notes;
    let filteredIds
    if (isManager || isAdmin) {
        filteredIds = [...ids]
    } else {
        filteredIds = ids.filter(noteId => entities[noteId].user === id)
    }
    console.log("filteredIds", filteredIds);
    const tableContent = filteredIds?.length
      ? filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)
      : null

    content = (
      <table className="table table--notes">
          <thead className="table__thead">
              <tr>
                  <th scope="col" className="table__th note__status">Username</th>
                  <th scope="col" className="table__th note__created">Created</th>
                  <th scope="col" className="table__th note__updated">Updated</th>
                  <th scope="col" className="table__th note__title">Title</th>
                  <th scope="col" className="table__th note__username">Owner</th>
                  <th scope="col" className="table__th note__edit">Edit</th>
              </tr>
          </thead>
          <tbody>
              {tableContent}
          </tbody>
      </table>
    )
  }
  return content;
}