import { useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { createSocketConnection } from "./socket";
import {
  clearPresence,
  setOnlineUsers,
  userOffline,
  userOnline,
} from "./presenceSlice";
import {
  clearAllUnread,
  clearUnread,
  incrementUnread,
  setUnread,
} from "./unreadSlice";

// Keeps one socket open while logged in, so you show as online to your
// connections and get told when they come online or go offline
const usePresence = () => {
  const userId = useSelector((store) => store.user?._id);
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      dispatch(clearPresence());
      dispatch(clearAllUnread());
      return;
    }

    const socket = createSocketConnection();
    socketRef.current = socket;

    const fetchOnline = () =>
      socket.emit("getOnlineConnections", (ids) =>
        dispatch(setOnlineUsers(ids))
      );

    // Unread counts from the server (also refreshed after a reconnect)
    const fetchUnread = () =>
      axios
        .get(BASE_URL + "/chat/unread", { withCredentials: true })
        .then((res) => dispatch(setUnread(res.data.data)))
        .catch(() => {});

    // Also runs after a reconnect, when the server's view may have changed
    socket.on("connect", () => {
      fetchOnline();
      fetchUnread();
    });

    // Someone sent me a message → +1 for that chat
    socket.on("newMessage", ({ fromUserId }) =>
      dispatch(incrementUnread(fromUserId))
    );
    // I read a chat (in any tab) → its count goes back to 0
    socket.on("chatRead", ({ targetUserId }) =>
      dispatch(clearUnread(targetUserId))
    );
    socket.on("presence", ({ userId: id, online }) =>
      dispatch(online ? userOnline(id) : userOffline(id))
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
      dispatch(clearPresence());
      dispatch(clearAllUnread());
    };
  }, [userId, dispatch]);

  // A newly accepted connection may already be online
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    socket.emit("getOnlineConnections", (ids) => dispatch(setOnlineUsers(ids)));
  }, [connections, dispatch]);
};

export default usePresence;
