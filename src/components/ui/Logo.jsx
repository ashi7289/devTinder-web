import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary font-mono text-sm font-bold text-white shadow-lg shadow-primary/30">
      {"</>"}
    </span>
    <span className="text-xl font-extrabold tracking-tight">
      Dev<span className="text-gradient">Tinder</span>
    </span>
  </Link>
);

export default Logo;
