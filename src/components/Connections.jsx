import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
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
      <div className="flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
        <h1 className="text-2xl font-bold text-base-content">
          No Connections Yet
        </h1>
        <p className="text-base-content/60 max-w-sm">
          Start swiping through the feed to find developers and build your
          network.
        </p>
        <Link to="/" className="btn btn-primary mt-2">
          Go to Feed
        </Link>
      </div>
    );

  return (
    <div className="text-center my-10 px-4">
      <h1 className="text-bold text-base-content text-3xl">Connections</h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center gap-4 m-4 p-4 rounded-lg bg-neutral text-neutral-content w-full sm:w-3/4 lg:w-1/2 mx-auto"
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
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
export default Connections;
