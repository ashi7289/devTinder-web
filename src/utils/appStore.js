import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./conectionSlice";
import requestReducer from "./requestSlice";
import presenceReducer from "./presenceSlice";
import unreadReducer from "./unreadSlice";
import { setLoginHint } from "./authHint";

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

// Keep the login hint in step with the user: set on login/signup,
// cleared on logout/delete account
let lastUser = appStore.getState().user;
appStore.subscribe(() => {
  const user = appStore.getState().user;
  if (user === lastUser) return;
  if (!user !== !lastUser) setLoginHint(!!user);
  lastUser = user;
});

export default appStore;
