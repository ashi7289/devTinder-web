import { Link } from "react-router-dom";
import Icon from "./Icon";

const EmptyState = ({ icon, title, text, actionLabel, actionTo }) => (
  <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center animate-fade-up">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
      <div className="relative grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-base-200">
        <Icon name={icon} className="h-9 w-9 text-primary" />
      </div>
    </div>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="max-w-sm text-base-content/60">{text}</p>
    {actionLabel && (
      <Link to={actionTo} className="btn-gradient mt-2">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
