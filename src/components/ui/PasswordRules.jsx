import Icon from "./Icon";

// Same rules as the backend's validator.isStrongPassword() defaults
export const PASSWORD_RULES = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  {
    label: "Symbol (e.g. @ # $ !)",
    test: (p) => /[-#!$@£%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/.test(p),
  },
];

export const missingPasswordRules = (password) =>
  PASSWORD_RULES.filter((rule) => !rule.test(password)).map((r) => r.label);

// Live checklist: each rule turns green once the password meets it
const PasswordRules = ({ password, highlightMissing = false }) => (
  <ul className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
    {PASSWORD_RULES.map((rule) => {
      const ok = rule.test(password);
      const color = ok
        ? "text-success"
        : highlightMissing
          ? "text-error"
          : "text-base-content/50";
      return (
        <li key={rule.label} className={`flex items-center gap-1.5 text-xs transition-colors ${color}`}>
          <span
            className={
              "grid h-4 w-4 shrink-0 place-items-center rounded-full " +
              (ok ? "bg-success/15" : "bg-white/5")
            }
          >
            {ok ? (
              <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3.5} />
            ) : (
              <span className="h-1 w-1 rounded-full bg-current" />
            )}
          </span>
          {rule.label}
        </li>
      );
    })}
  </ul>
);

export default PasswordRules;
