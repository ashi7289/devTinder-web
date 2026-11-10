// Read-only skill chips; shows the first `max` and a "+N" for the rest
const SkillTags = ({ skills, max = 5, light = false, className = "" }) => {
  if (!skills?.length) return null;
  const shown = skills.slice(0, max);
  const extra = skills.length - shown.length;
  const chip = light
    ? "border-white/20 bg-white/10 text-white/90"
    : "border-primary/20 bg-primary/10 text-primary";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((skill) => (
        <span key={skill} className={`chip font-mono ${chip}`}>
          {skill}
        </span>
      ))}
      {extra > 0 && (
        <span className={`chip ${light ? chip : ""}`}>+{extra}</span>
      )}
    </div>
  );
};

export default SkillTags;
