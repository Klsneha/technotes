import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.token = null;
    }
  }
});


export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;  // Export the reducer to be used in the store

export const selectCurrentToken = (state: { auth: { token: string; }; }) => state.auth.token; // Selector to get the current token from the state