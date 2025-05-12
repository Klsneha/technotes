import { useParams } from "react-router-dom";
import { selectNoteById  } from "./NotesApiSlice";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../Users/UsersApiSlice";
import NoteForm from "./NoteForm";

const EditNote = () => {
  const { id } = useParams();
  const noteDetails = useSelector(state => selectNoteById(state, id ?? ""));
  const { 
    data: usersList
  } =  useGetUsersQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
    refetchOnFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true // Refetch when the browser reconnects
  });
  
  return (
    <NoteForm note={noteDetails} users={usersList} />
  );
};
export default EditNote;