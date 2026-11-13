import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { selectTotalUnread } from "../utils/unreadSlice";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Icon from "./ui/Icon";
import EmptyState from "./ui/EmptyState";
import PageHeader from "./ui/PageHeader";
import PersonCard from "./ui/PersonCard";
import VirtualList from "./ui/VirtualList";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const onlineIds = useSelector((store) => store.presence);
  const unread = useSelector((store) => store.unread);
  const totalUnread = useSelector(selectTotalUnread);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return <Loader />;

  if (connections.length === 0)
    return (
      <EmptyState
        icon="users"
        title="No connections yet"
        text="Start swiping through the feed to find developers and build your network."
        actionLabel="Discover developers"
        actionTo="/"
      />
    );

  const q = query.trim().toLowerCase();
  const visible = q
    ? connections.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q),
      )
    : connections;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <PageHeader
        title="Messages"
        count={totalUnread > 0 ? totalUnread : undefined}
        subtitle="Your connections. Say hi and start building."
      >
        <label className="relative sm:w-64">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search connections"
            className="field pl-10"
          />
        </label>
      </PageHeader>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-base-content/50">
          No connections match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <VirtualList
          items={visible}
          getKey={(connection) => connection._id}
          renderItem={(connection, i) => {
            const unreadCount = unread[connection._id] || 0;
            return (
              <PersonCard
                person={connection}
                online={onlineIds.includes(connection._id)}
                // stagger only the first screen; rows scrolled in later show at once
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <Link
                  to={"/chat/" + connection._id}
                  className="btn-gradient w-full sm:w-auto"
                >
                  <Icon name="message" className="h-4 w-4" />
                  Chat
                  {unreadCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-primary">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              </PersonCard>
            );
          }}
        />
      )}
    </div>
  );
};
export default Connections;
