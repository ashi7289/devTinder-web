import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/conectionSlice";
import { addRequests, removeRequests } from "../utils/requestSlice";

// Red on hover, and stays red for the page you are on
const navLinkClass = ({ isActive }) =>
  "flex flex-col items-center text-xs hover:text-accent " +
  (isActive ? "text-accent" : "text-base-content/70");

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="navbar bg-base-100 text-accent px-2 md:px-4 shadow-md">
      <div className="flex-1 min-w-0 flex items-center">
        <Link
          to="/"
          className="btn btn-ghost text-lg md:text-xl truncate text-accent"
        >
          👩‍💻 DevTinder
        </Link>
        {user && (
          <div className="hidden md:flex items-center gap-[3rem] ml-[25rem] px-4">
            <NavLink
              to="/" end
              className={navLinkClass}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3z" />
              </svg>
              Home
            </NavLink>
            <NavLink
              to="/requests"
              className={navLinkClass}
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm7 2h-2.18a6.98 6.98 0 0 1-9.64 0H5a4 4 0 0 0-4 4v3h22v-3a4 4 0 0 0-4-4z" />
                </svg>
                {requestCount > 0 && (
                  <span className="badge badge-error badge-xs absolute -top-2 -right-3 h-4 min-w-4 px-1 text-[10px] font-bold text-white">
                    {requestCount > 99 ? "99+" : requestCount}
                  </span>
                )}
              </div>
              Requests
            </NavLink>
            <NavLink
              to="/connections"
              className={navLinkClass}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z" />
              </svg>
              Messaging
            </NavLink>
          </div>
        )}
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control hidden sm:block">
            Welcome, {user.firstName}
          </div>
          <div className="dropdown dropdown-end mx-1 md:mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              <li className="md:hidden">
                <Link to="/connections">Connections</Link>
              </li>
              <li className="md:hidden">
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium" className="font-bold">
                  Premium
                </Link>
              </li>
              <li>
                <a
                  onClick={loggingOut ? undefined : handleLogout}
                  className={loggingOut ? "pointer-events-none" : ""}
                >
                  {loggingOut && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavBar;
