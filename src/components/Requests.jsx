import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Icon from "./ui/Icon";
import EmptyState from "./ui/EmptyState";
import PageHeader from "./ui/PageHeader";
import PersonCard from "./ui/PersonCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loadingKey, setLoadingKey] = useState(null);

  const reviewRequest = async (status, _id) => {
    setLoadingKey(_id + status);
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch {
      // keep the request so the user can retry
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
    } catch {
      // leave the loader / previous list in place
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <Loader />;

  // Skip requests whose sender no longer exists (backend populate returns null)
  const validRequests = requests.filter((request) => request.fromUserId);

  if (validRequests.length === 0)
    return (
      <EmptyState
        icon="userPlus"
        title="No pending requests"
        text="When a developer is interested in you, they'll show up here. Keep swiping to get noticed."
        actionLabel="Discover developers"
        actionTo="/"
      />
    );

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <PageHeader
        title="Requests"
        count={validRequests.length}
        subtitle="Developers who want to connect with you."
      />

      <div className="space-y-4">
        {validRequests.map((request, i) => (
          <PersonCard
            key={request._id}
            person={request.fromUserId}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <button
              className="btn flex-1 border-white/10 bg-base-300 hover:border-error/40 hover:bg-error/10 hover:text-error sm:flex-none"
              onClick={() => reviewRequest("rejected", request._id)}
              disabled={loadingKey !== null}
            >
              {loadingKey === request._id + "rejected" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Icon name="x" className="h-4 w-4" />
              )}
              Decline
            </button>
            <button
              className="btn-gradient flex-1 sm:flex-none"
              onClick={() => reviewRequest("accepted", request._id)}
              disabled={loadingKey !== null}
            >
              {loadingKey === request._id + "accepted" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Icon name="check" className="h-4 w-4" />
              )}
              Accept
            </button>
          </PersonCard>
        ))}
      </div>
    </div>
  );
};
export default Requests;
