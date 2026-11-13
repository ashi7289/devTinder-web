import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";

// "2:45 PM" today, "Yesterday 2:45 PM", otherwise "12 Nov, 2:45 PM"
const formatTime = (date) => {
  const d = new Date(date);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return time;
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday " + time;
  return (
    d.toLocaleDateString([], { day: "numeric", month: "short" }) + ", " + time
  );
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const isOnline = useSelector((store) =>
    store.presence.includes(targetUserId),
  );
  const userId = user?._id;
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  // true when the server says you are not connected to this user
  const [notAllowed, setNotAllowed] = useState(false);
  // When the other person last read this chat (null = never)
  const [otherLastRead, setOtherLastRead] = useState(null);
  // true until the chat history has loaded
  const [loading, setLoading] = useState(true);
  // first jump to the bottom is instant, later ones scroll smoothly
  const scrolledOnce = useRef(false);
  // stop waiting for the header info if connections can't be loaded
  const [connectionsFailed, setConnectionsFailed] = useState(false);
  // Show the spinner (and hide the header) until messages and header info are ready
  const showLoader = loading || (!connections && !connectionsFailed);

  // Header info comes from the connections list when it's already loaded
  const target = connections?.find((c) => c._id === targetUserId);
  const dispatch = useDispatch();

  // After a page reload the store is empty, so load connections for the header
  useEffect(() => {
    if (connections) return;
    axios
      .get(BASE_URL + "/user/connections", { withCredentials: true })
      .then((res) => dispatch(addConnections(res.data.data)))
      .catch((err) => {
        console.error(err);
        setConnectionsFailed(true);
      });
  }, [connections, dispatch]);

  const fetchChatMessages = async () => {
    let chat;
    try {
      chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
    } catch (err) {
      if (err.response?.status === 403) setNotAllowed(true);
      setLoading(false);
      return;
    }

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;
      return {
        senderId: senderId?._id,
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt,
      };
    });
    setMessages(chatMessages);
    setOtherLastRead(chat?.data?.lastRead?.[targetUserId] || null);
    setLoading(false);
  };
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    socketRef.current = socket;

    // Server rejected the connection (no/invalid token)
    socket.on("connect_error", (err) => {
      console.error("Socket auth failed:", err.message);
    });

    // Join the chat room on every connect (also after a reconnect, which starts with no rooms)
    // userId comes from the token on the server, so we only send targetUserId
    // Opening the chat also marks it as read
    const markRead = () => socket.emit("markRead", { targetUserId });

    socket.on("connect", () => {
      socket.emit("joinChat", { targetUserId });
      markRead();
    });

    // Server refused because you are not connected to this user
    socket.on("chatError", () => setNotAllowed(true));

    socket.on("messageReceived", (message) => {
      setMessages((messages) => [...messages, message]);
      // A message from the other person while I'm looking at the chat → read
      if (message.senderId !== userId && !document.hidden) markRead();
    });

    // The other person read the chat → my messages become "Seen"
    socket.on("messagesRead", ({ userId: readerId, readAt }) => {
      if (readerId === targetUserId) setOtherLastRead(readAt);
    });

    // Coming back to this tab → mark what's on screen as read
    const onVisible = () => {
      if (!document.hidden) markRead();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  // Keep the newest message in view. useLayoutEffect runs before paint,
  // so the first jump to the last message happens before anything is shown.
  useLayoutEffect(() => {
    if (showLoader) return;
    bottomRef.current?.scrollIntoView({
      behavior: scrolledOnce.current ? "smooth" : "auto",
    });
    scrolledOnce.current = true;
  }, [messages, showLoader]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // reuse the same authenticated socket instead of opening a new one
    socketRef.current?.emit("sendMessage", {
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  // Status is shown under my latest message only
  const lastMineIndex = messages.findLastIndex((m) => m.senderId === userId);
  const isSeen = (msg) =>
    otherLastRead && new Date(msg.createdAt) <= new Date(otherLastRead);

  if (notAllowed) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h2 className="text-xl font-semibold">
          You can&apos;t chat with this user
        </h2>
        <p className="opacity-70">
          You can only message people you are connected with.
        </p>
        <Link to="/connections" className="btn btn-primary btn-sm">
          Go to Connections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] max-w-3xl flex-col px-0 pt-0 sm:px-4 sm:pt-6 md:h-[calc(100dvh-6.5rem)]">
      <div className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-none sm:rounded-box">
        {!showLoader && (
          <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
            <Link
              to="/connections"
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="Back to messages"
            >
              <Icon name="arrowLeft" className="h-5 w-5" />
            </Link>
            {target ? (
              <>
                <Avatar
                  src={target.photoUrl}
                  firstName={target.firstName}
                  lastName={target.lastName}
                  className="h-10 w-10 text-sm"
                  ring={false}
                  online={isOnline}
                />
                <div className="min-w-0">
                  <h1 className="truncate font-semibold">
                    {target.firstName} {target.lastName}
                  </h1>
                  <p
                    className={
                      "text-xs " + (isOnline ? "text-success" : "text-gray-500")
                    }
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </>
            ) : (
              <h1 className="font-semibold">Chat</h1>
            )}
          </div>
        )}

        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {showLoader && (
            <div className="flex h-full items-center justify-center">
              <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
          )}
          {!showLoader && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-base-content/50">
              <Icon name="message" className="h-10 w-10 text-primary/60" />
              <p>No messages yet</p>
              <p className="text-sm">
                {target
                  ? `Say hi to ${target.firstName} and see what they're working on.`
                  : "Say hi and see what they're working on."}
              </p>
            </div>
          )}
          {!showLoader &&
            messages.map((msg, index) => {
              const mine = msg.senderId === userId;
              return (
                <div
                  key={index}
                  className={
                    "flex flex-col " + (mine ? "items-end" : "items-start")
                  }
                >
                  <div
                    className={
                      "max-w-[78%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow " +
                      (mine
                        ? "rounded-br-md bg-gradient-to-br from-primary to-secondary text-white"
                        : "rounded-bl-md border border-white/5 bg-base-300 text-base-content")
                    }
                  >
                    {msg.text}
                  </div>
                  {index === lastMineIndex && (
                    <span className="mt-1 px-1 text-xs text-base-content/50">
                      {isSeen(msg)
                        ? "Seen " + formatTime(otherLastRead)
                        : "Sent " + formatTime(msg.createdAt)}
                    </span>
                  )}
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 border-t border-white/5 p-3"
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            className="field flex-1 rounded-full"
          />
          <button
            type="submit"
            className="btn btn-circle border-0 bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 hover:brightness-110"
            disabled={!newMessage.trim()}
            aria-label="Send"
          >
            <Icon name="send" className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
