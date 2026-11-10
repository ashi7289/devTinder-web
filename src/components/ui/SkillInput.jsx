import { useState } from "react";
import Icon from "./Icon";

const MAX_SKILLS = 10;
const MAX_LENGTH = 25;
const SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
  "Go", "MongoDB", "SQL", "AWS", "Docker", "Next.js",
];

// Type a skill and press Enter or comma to add it; click × to remove
const SkillInput = ({ skills, onChange }) => {
  const [draft, setDraft] = useState("");
  const full = skills.length >= MAX_SKILLS;
  const has = (s) => skills.some((x) => x.toLowerCase() === s.toLowerCase());

  const add = (raw) => {
    const skill = raw.trim().slice(0, MAX_LENGTH);
    if (skill && !has(skill) && !full) onChange([...skills, skill]);
    setDraft("");
  };

  const remove = (skill) => onChange(skills.filter((s) => s !== skill));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && skills.length) {
      remove(skills[skills.length - 1]);
    }
  };

  const suggestions = SUGGESTIONS.filter((s) => !has(s));

  return (
    <div>
      <span className="field-label flex justify-between">
        Skills
        <span className="font-mono text-xs text-base-content/40">
          {skills.length}/{MAX_SKILLS}
        </span>
      </span>

      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-btn border border-white/10 bg-base-300/60 px-3 py-2 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30">
        {skills.map((skill) => (
          <span
            key={skill}
            className="chip border-primary/30 bg-primary/10 font-mono text-primary"
          >
            {skill}
            <button
              type="button"
              onClick={() => remove(skill)}
              className="-mr-1 rounded-full p-0.5 hover:bg-primary/20"
              aria-label={`Remove ${skill}`}
            >
              <Icon name="x" className="h-3 w-3" strokeWidth={3} />
            </button>
          </span>
        ))}
        {!full && (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => draft && add(draft)}
            maxLength={MAX_LENGTH}
            placeholder={skills.length ? "Add another…" : "e.g. React, then press Enter"}
            className="min-w-[8rem] flex-1 bg-transparent py-1 text-base outline-none placeholder:text-base-content/30"
          />
        )}
      </div>

      {!full && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="chip transition hover:border-primary/40 hover:text-primary"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillInput;
