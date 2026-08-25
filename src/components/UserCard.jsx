import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [loadingStatus, setLoadingStatus] = useState(null);

  const handleSendRequest = async (status, userId) => {
    setLoadingStatus(status);
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="card bg-base-300 w-full max-w-sm mx-auto shadow-xl">
      <figure className="h-80">
        <img
          src={user.photoUrl}
          alt="photo"
          className="w-full h-full object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        {showActions && (
          <div className="card-actions justify-center my-4">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest("ignored", _id)}
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "ignored" && (
                <span className="loading loading-spinner"></span>
              )}
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", _id)}
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "interested" && (
                <span className="loading loading-spinner"></span>
              )}
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserCard;
