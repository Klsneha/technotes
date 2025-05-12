
import { useGetUsersQuery } from "../Users/UsersApiSlice";
import { Link } from "react-router-dom";
import NoteForm from "./NoteForm";

const NewNote = () => {
  const { 
    data: usersList,
    isLoading,
    isSuccess,
    isError,
    error
  } =  useGetUsersQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
    refetchOnFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true // Refetch when the browser reconnects
  });

  let content = <></>;
    if (isLoading) {
      content = <p>Loading...</p>;
      
    } else if ( isError ) {
      content = <p className={"errmsg"}>{(error as any)?.data.message}</p>;
    } else if (isSuccess) {
      if (usersList) {
        content = <NoteForm users={usersList} />
      } else {
        content = <Link to="/dashboard/users/new">No Users found!. Add New User</Link>;
      }
    }
    return content;
  
}
export default NewNote;