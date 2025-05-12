import * as React from 'react';
import { Route, Routes } from 'react-router-dom'
import { Layout } from './Components/Layout.tsx'
import { Public } from './Components/public.tsx';
import { Login } from './Features/Auth/Login.tsx';
import { DashboardLayout } from './Components/DashboardLayout.tsx';
import { Welcome } from './Features/Auth/Welcome.tsx';
import { NotesList } from './Features/Notes/NotesList.tsx';
import { UsersList } from './Features/Users/UsersList.tsx';
import EditUser from './Features/Users/EditUser.tsx';
import NewUserForm from './Features/Users/NewUserForm.tsx';
import EditNote from './Features/Notes/EditNote.tsx';
import NewNote from './Features/Notes/NewNote.tsx';
import Prefetch from './Features/Auth/Prefetch.tsx';
import PersistLogin from './Features/Auth/PersistLogin.tsx';
import RequireAuth from './Features/Auth/RequiredAuth.tsx';
import { Role } from './config/roles.ts';

export const App: React.FC<{ }> = () => {
  return (
    <Routes>
      <Route path = "/" element={<Layout />} >

        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(Role)]} />}>
            <Route element={<Prefetch/>}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<Welcome />} />
                <Route element={<RequireAuth allowedRoles={[Role.MANAGER, Role.ADMIN]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route> 
    </Routes>
  );
}