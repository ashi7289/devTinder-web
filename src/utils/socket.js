import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  // withCredentials: send the "token" cookie so the server can authenticate the socket
  if (location.hostname === "localhost") {
    return io(BASE_URL, { withCredentials: true });
  } else {
    return io("/", { path: "/api/socket.io", withCredentials: true });
  }
};
