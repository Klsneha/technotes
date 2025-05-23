import { SerializedError } from "@reduxjs/toolkit";
import User from "./User";
import { useGetUsersQuery } from "./UsersApiSlice";

export const UsersList = () => {
  const { 
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
    refetchOnFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true // Refetch when the browser reconnects
  });
  
  let content = <></>;
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (isError) {
    content = <p className={"errmsg"}>{(error as any)?.data?.message}</p>;
  }
  if (isSuccess) {
    const { ids } = users

    const tableContent = ids?.length
        ? ids.map(userId => <User key={userId} userId={userId} />)
        : null;

    content = (
      <table className="table table--users">
          <thead className="table__thead">
              <tr>
                  <th scope="col" className="table__th user__username">Username</th>
                  <th scope="col" className="table__th user__roles">Roles</th>
                  <th scope="col" className="table__th user__edit">Edit</th>
              </tr>
          </thead>
          <tbody>
              {tableContent}
          </tbody>
      </table>
      )
  }
  
  return content;
};