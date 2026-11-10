import { useState } from "react";
import Icon from "./Icon";

// Labelled input with an optional leading icon and a show/hide toggle for passwords
const TextField = ({ label, icon, type = "text", value, onChange, ...rest }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-base-content/40"
          />
        )}
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`field ${icon ? "pl-10" : ""} ${isPassword ? "pr-11" : ""}`}
          // No red spell-check squiggles or auto-capitals on emails/passwords
          {...(type === "email" || isPassword
            ? { spellCheck: false, autoCapitalize: "none", autoCorrect: "off" }
            : {})}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-3 z-10 flex items-center text-base-content/40 transition hover:text-base-content"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <Icon name={show ? "eye" : "eyeOff"} className="h-5 w-5" />
          </button>
        )}
      </div>
    </label>
  );
};

export default TextField;
