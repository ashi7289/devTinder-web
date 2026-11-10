import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/conectionSlice";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { selectTotalUnread } from "../utils/unreadSlice";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import Logo from "./ui/Logo";

const NAV_ITEMS = [
  { to: "/", label: "Discover", icon: "home", end: true },
  { to: "/requests", label: "Requests", icon: "userPlus", badge: "requests" },
  { to: "/connections", label: "Messages", icon: "message", badge: "messages" },
];

const CountBadge = ({ count, className = "" }) =>
  count > 0 && (
    <span
      className={`absolute grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-r from-primary to-secondary px-1 text-[10px] font-bold text-white ring-2 ring-base-100 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const unreadCount = useSelector(selectTotalUnread);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Load pending requests so the navbar badge shows a count on every page
  useEffect(() => {
    if (!user || requests) return;
    axios
      .get(BASE_URL + "/user/requests/received", { withCredentials: true })
      .then((res) => dispatch(addRequests(res.data.data)))
      .catch(() => {});
  }, [user]);

  // Ignore requests whose sender no longer exists, same as the Requests page
  const requestCount = requests
    ? requests.filter((request) => request.fromUserId).length
    : 0;

  const badgeCounts = { requests: requestCount, messages: unreadCount };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      return navigate("/login");
    } catch {
      // Error logic maybe redirect to error page
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />

          {user && (
            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-base-200/60 p-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition " +
                    (isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                      : "text-base-content/60 hover:bg-white/5 hover:text-base-content")
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <CountBadge count={badgeCounts[item.badge]} className="-right-1 -top-1" />
                  )}
                </NavLink>
              ))}
            </nav>
          )}

          {user && (
            <div className="flex items-center gap-3">
              {/* Premium is on hold for now
              <Link
                to="/premium"
                className="hidden items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning transition hover:bg-warning/20 sm:flex"
              >
                <Icon name="crown" className="h-3.5 w-3.5" />
                Go Premium
              </Link>
              */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-white/5 sm:pr-3"
                >
                  <Avatar
                    src={user.photoUrl}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    className="h-9 w-9 text-sm"
                    ring={false}
                  />
                  <span className="hidden text-sm font-medium sm:block">
                    {user.firstName}
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-white/10 bg-base-200 p-2 shadow-2xl"
                >
                  <li className="pointer-events-none mb-1 border-b border-white/5 px-4 pb-3 pt-2">
                    <div className="flex flex-col items-start gap-0 p-0">
                      <span className="font-semibold">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="font-mono text-xs text-base-content/50">
                        @{(user.firstName || "dev").toLowerCase()}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link to="/profile">
                      <Icon name="user" className="h-4 w-4" /> My Profile
                    </Link>
                  </li>
                  {/* Premium is on hold for now
                  <li>
                    <Link to="/premium" className="text-warning">
                      <Icon name="crown" className="h-4 w-4" /> Premium
                    </Link>
                  </li>
                  */}
                  <li>
                    <a
                      onClick={loggingOut ? undefined : handleLogout}
                      className={
                        "text-error " + (loggingOut ? "pointer-events-none" : "")
                      }
                    >
                      {loggingOut ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Icon name="logout" className="h-4 w-4" />
                      )}
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-base-100/85 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-md justify-around px-2 pb-[env(safe-area-inset-bottom)]">
            {[...NAV_ITEMS, { to: "/profile", label: "Profile", icon: "user" }].map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition " +
                    (isActive ? "text-primary" : "text-base-content/50")
                  }
                >
                  <span className="relative">
                    <Icon name={item.icon} className="h-6 w-6" />
                    {item.badge && (
                      <CountBadge count={badgeCounts[item.badge]} className="-right-2.5 -top-1.5" />
                    )}
                  </span>
                  {item.label}
                </NavLink>
              )
            )}
          </div>
        </nav>
      )}
    </>
  );
};
export default NavBar;
