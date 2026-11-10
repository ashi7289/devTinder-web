import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center animate-fade-up">
      <h1 className="text-gradient font-mono text-8xl font-extrabold">404</h1>
      <p className="font-mono text-sm text-base-content/50">
        Error: route not found
      </p>
      <p className="max-w-sm text-base-content/70">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn-gradient mt-2">
        Back to Discover
      </Link>
    </div>
  );
};
export default NotFound;
