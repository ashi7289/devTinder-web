import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-10 px-4">
      <div className="card bg-neutral text-neutral-content w-full max-w-sm shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>
          <div>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-neutral-content">
                  First Name
                </span>
              </div>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-neutral-content">
                  Last Name
                </span>
              </div>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-neutral-content">
                  Email ID:
                </span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-neutral-content">
                  Password
                </span>
              </div>
              <div className="relative w-full max-w-xs">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="input input-bordered w-full pr-10 bg-base-100 text-base-content"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-base-content/60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 6c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 9.11 17 6 12 6zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M2 4.27 3.28 3 21 20.72 19.73 22l-3.08-3.08A11.94 11.94 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a12.02 12.02 0 0 1 4.17-5.4L2 4.27zM12 7c.51 0 1 .07 1.47.2l-1.66 1.66a3 3 0 0 0-3.35 3.35l-1.66 1.66A5 5 0 0 1 12 7zm0 10a4.98 4.98 0 0 1-4.6-3.06l1.5-1.5a3 3 0 0 0 3.66 3.66l1.5-1.5A5 5 0 0 1 12 17zm9.9-4.5a11.9 11.9 0 0 1-3.16 4.24l-1.43-1.43a9.9 9.9 0 0 0 2.56-2.81 9.9 9.9 0 0 0-8.16-5.44l-1.6-1.6C10.4 5.16 11.19 5 12 5c5 0 9.27 3.11 11 7.5-.19.5-.42.98-.68 1.44l-1.42-1.44z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>
          <p className="text-base-100 font-semibold">{error}</p>
          <div className="card-actions justify-center m-2">
            <button
              className="btn btn-secondary"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Sign Up
            </button>
          </div>

          <Link to="/login" className="m-auto cursor-pointer py-2">
            Existing User? <span className="underline">Login Here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;
