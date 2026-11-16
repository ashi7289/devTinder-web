import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (BASE_URL.startsWith("http")) {
    return io(BASE_URL, { withCredentials: true });
  }
  return io("/", { path: `${BASE_URL}/socket.io`, withCredentials: true });
};
