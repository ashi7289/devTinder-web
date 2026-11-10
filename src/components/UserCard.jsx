import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import Icon from "./ui/Icon";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  const handleSendRequest = async (status, userId) => {
    setLoadingStatus(status);
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch {
      // keep the card so the user can try again
    } finally {
      setLoadingStatus(null);
    }
  };

  const initials = ((firstName || "")[0] || "") + ((lastName || "")[0] || "");
  const busy = loadingStatus !== null;

  return (
    <div className="w-full max-w-sm">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-white/10 bg-base-300 shadow-2xl shadow-black/50">
        {photoUrl && !photoFailed ? (
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/80 via-secondary/60 to-accent/80 text-7xl font-extrabold uppercase text-white/90">
            {initials || "?"}
          </div>
        )}

        {/* Dark fade so the text on top stays readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {firstName} {lastName}
            {age && <span className="ml-2 font-light text-white/80">{age}</span>}
          </h2>
          {gender && (
            <div className="mt-2">
              <span className="chip border-white/20 bg-white/10 capitalize text-white/90">
                {gender}
              </span>
            </div>
          )}
          {about && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">
              {about}
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-6 flex items-center justify-center gap-8">
          <button
            className="group grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-base-200 text-error shadow-xl transition hover:scale-110 hover:border-error/50 hover:bg-error/10 active:scale-95 disabled:opacity-50"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={busy}
            aria-label="Pass"
            title="Pass"
          >
            {loadingStatus === "ignored" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Icon name="x" className="h-7 w-7" strokeWidth={2.5} />
            )}
          </button>
          <button
            className="grid h-20 w-20 place-items-center rounded-full bg-error text-white shadow-xl shadow-error/40 transition hover:scale-110 hover:brightness-90 hover:shadow-error/60 active:scale-95 disabled:opacity-50"
            onClick={() => handleSendRequest("interested", _id)}
            disabled={busy}
            aria-label="Interested"
            title="Interested"
          >
            {loadingStatus === "interested" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Icon name="check" className="h-9 w-9" strokeWidth={3} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default UserCard;
