import { createSlice } from "@reduxjs/toolkit";

// Unread message count per connection: { [userId]: count }
const unreadSlice = createSlice({
  name: "unread",
  initialState: {},
  reducers: {
    setUnread: (state, action) => action.payload,
    incrementUnread: (state, action) => {
      state[action.payload] = (state[action.payload] || 0) + 1;
    },
    clearUnread: (state, action) => {
      delete state[action.payload];
    },
    clearAllUnread: () => ({}),
  },
});

export const { setUnread, incrementUnread, clearUnread, clearAllUnread } =
  unreadSlice.actions;

// Total unread messages across all chats
export const selectTotalUnread = (store) =>
  Object.values(store.unread).reduce((sum, n) => sum + n, 0);

export default unreadSlice.reducer;
