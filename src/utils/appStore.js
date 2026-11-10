import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./conectionSlice";
import requestReducer from "./requestSlice";
import presenceReducer from "./presenceSlice";
import unreadReducer from "./unreadSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    presence: presenceReducer,
    unread: unreadReducer,
  },
});

export default appStore;
