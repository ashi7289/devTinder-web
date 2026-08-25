import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
      <h1 className="text-3xl font-bold text-accent">404</h1>
      <p className="text-accent/70 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn btn-primary mt-2">
        Go to Feed
      </Link>
    </div>
  );
};
export default NotFound;
