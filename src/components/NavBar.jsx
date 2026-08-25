import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/conectionSlice";
import { removeRequests } from "../utils/requestSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

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
            <Link
              to="/"
              className="flex flex-col items-center text-xs text-base-content/70 hover:text-accent"
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
            </Link>
            <Link
              to="/requests"
              className="flex flex-col items-center text-xs text-base-content/70 hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm7 2h-2.18a6.98 6.98 0 0 1-9.64 0H5a4 4 0 0 0-4 4v3h22v-3a4 4 0 0 0-4-4z" />
              </svg>
              My Network
            </Link>
            <Link
              to="/connections"
              className="flex flex-col items-center text-xs text-base-content/70 hover:text-accent"
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
            </Link>
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
                <Link to="/profile">Profile</Link>
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
