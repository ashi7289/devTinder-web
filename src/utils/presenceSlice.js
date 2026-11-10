import { createSlice } from "@reduxjs/toolkit";

// Ids of the logged-in user's connections who are online right now
const presenceSlice = createSlice({
  name: "presence",
  initialState: [],
  reducers: {
    setOnlineUsers: (state, action) => action.payload,
    userOnline: (state, action) =>
      state.includes(action.payload) ? state : [...state, action.payload],
    userOffline: (state, action) => state.filter((id) => id !== action.payload),
    clearPresence: () => [],
  },
});

export const { setOnlineUsers, userOnline, userOffline, clearPresence } =
  presenceSlice.actions;
export default presenceSlice.reducer;
