import { store } from '../../app/store'
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { notesApiSlice } from '../Notes/NotesApiSlice';
import { usersApiSlice } from '../Users/UsersApiSlice';

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

    return () => {
      console.log('unsubscribing')
      notes.unsubscribe()
      users.unsubscribe()
    }
  }, [])

  return <Outlet />
}
export default Prefetch;