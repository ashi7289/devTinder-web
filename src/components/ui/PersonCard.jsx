import Avatar from "./Avatar";

// One developer row used by Requests and Connections; actions go in children
const PersonCard = ({ person, children, style, online }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = person;
  const meta = [age, gender].filter(Boolean).join(" · ");

  return (
    <div
      style={style}
      className="group flex animate-fade-up flex-col gap-4 rounded-box border border-white/10 bg-base-200/70 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar
          src={photoUrl}
          firstName={firstName}
          lastName={lastName}
          className="h-16 w-16 text-lg"
          online={online}
        />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">
            {firstName} {lastName}
          </h2>
          {online !== undefined && (
            <p
              className={
                "text-xs font-medium " +
                (online ? "text-success" : "text-gray-500")
              }
            >
              {online ? "Online now" : "Offline"}
            </p>
          )}
          {meta && (
            <p className="text-sm capitalize text-base-content/50">{meta}</p>
          )}
          {about && (
            <p className="mt-1 line-clamp-2 text-sm text-base-content/70">
              {about}
            </p>
          )}
        </div>
      </div>
      {children && <div className="flex shrink-0 gap-2">{children}</div>}
    </div>
  );
};

export default PersonCard;
