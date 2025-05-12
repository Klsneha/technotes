import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
export const Welcome = () => {
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
  const { userName, isManager, isAdmin} = useAuth();

  const content = (
      <section className="welcome">

          <p>{today}</p>

          <h1>Welcome! {userName}</h1>

          <p><Link to="/dashboard/notes">View techNotes</Link></p>

          <p><Link to="/dashboard/notes/new">Add New techNote</Link></p>

          {(isAdmin || isManager) && 
          <>
            <p><Link to="/dashboard/users">View User Settings</Link></p>

            <p><Link to="/dashboard/users/new">Add New User</Link></p>
          </>}

      </section>
  )

  return content
};