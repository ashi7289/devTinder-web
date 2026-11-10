import { useEffect, useState } from "react";

// Profile photo with a gradient-initials fallback when the URL is missing or broken
const Avatar = (props) => {
  const { online } = props;
  const image = <AvatarImage {...props} />;
  if (online === undefined) return image;

  // Wrap with a status dot: green when online, grey when offline
  return (
    <span className="relative inline-flex shrink-0">
      {image}
      <span
        title={online ? "Online" : "Offline"}
        className={
          "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-[3px] ring-base-200 " +
          (online ? "bg-success" : "bg-gray-500")
        }
      />
    </span>
  );
};

const AvatarImage = ({ src, firstName = "", lastName = "", className = "w-14 h-14", ring = true }) => {
  const [failed, setFailed] = useState(false);
  // Try again whenever the photo URL changes
  useEffect(() => setFailed(false), [src]);
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const ringClass = ring
    ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-base-200"
    : "";

  if (!src || failed) {
    return (
      <div
        className={`${className} ${ringClass} shrink-0 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center font-bold text-white uppercase`}
      >
        {initials || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${firstName} ${lastName}`.trim() || "profile photo"}
      onError={() => setFailed(true)}
      className={`${className} ${ringClass} shrink-0 rounded-full object-cover bg-base-300`}
    />
  );
};

export default Avatar;
