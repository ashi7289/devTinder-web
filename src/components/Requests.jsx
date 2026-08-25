import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loadingKey, setLoadingKey] = useState(null);

  const reviewRequest = async (status, _id) => {
    setLoadingKey(_id + status);
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
    } finally {
      setLoadingKey(null);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <Loader />;

  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
        <h1 className="text-2xl font-bold text-base-content">
          No Requests Found
        </h1>
        <p className="text-base-content/60 max-w-sm">
          You don&apos;t have any pending connection requests right now. Check
          back later, or explore the feed to connect with more developers.
        </p>
        <Link to="/" className="btn btn-primary mt-2">
          Go to Feed
        </Link>
      </div>
    );

  return (
    <div className="text-center my-10 px-4">
      <h1 className="text-bold text-base-content text-3xl">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 m-4 p-4 rounded-lg bg-neutral text-neutral-content w-full sm:w-3/4 lg:w-1/2 mx-auto"
          >
            <img
              alt="photo"
              className="w-20 h-20 rounded-full object-cover shrink-0"
              src={photoUrl}
            />
            <div className="text-center sm:text-left flex-1">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => reviewRequest("rejected", request._id)}
                disabled={loadingKey !== null}
              >
                {loadingKey === request._id + "rejected" && (
                  <span className="loading loading-spinner"></span>
                )}
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => reviewRequest("accepted", request._id)}
                disabled={loadingKey !== null}
              >
                {loadingKey === request._id + "accepted" && (
                  <span className="loading loading-spinner"></span>
                )}
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
