import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import Loader from "./Loader";
import EmptyState from "./ui/EmptyState";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch {
      //TODO: handle error
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return <Loader />;

  if (feed.length <= 0)
    return (
      <EmptyState
        icon="sparkles"
        title="You're all caught up!"
        text="You've seen every developer for now. Check your requests or chat with your connections while new devs join."
        actionLabel="View connections"
        actionTo="/connections"
      />
    );

  return (
    <div className="flex flex-col items-center px-4 pt-8">
      <div className="mb-6 text-center">
        <h1 className="page-title">
          Discover <span className="text-gradient">developers</span>
        </h1>
        <p className="mt-1 font-mono text-sm text-base-content/50">
          {feed.length} {feed.length === 1 ? "profile" : "profiles"} waiting
        </p>
      </div>

      {/* Ghost cards behind give the stacked-deck look */}
      <div className="relative w-full max-w-sm">
        {feed.length > 1 && (
          <>
            <div className="absolute inset-x-6 top-0 aspect-[3/4] translate-y-6 rounded-[1.75rem] border border-white/5 bg-base-200/60" />
            <div className="absolute inset-x-3 top-0 aspect-[3/4] translate-y-3 rounded-[1.75rem] border border-white/5 bg-base-300/80" />
          </>
        )}
        <div key={feed[0]._id} className="relative animate-fade-up">
          <UserCard user={feed[0]} />
        </div>
      </div>
    </div>
  );
};
export default Feed;
