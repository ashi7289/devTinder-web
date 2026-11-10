import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

// Themed dropdown; the native <select> list can't be styled on most browsers
const Select = ({ label, value, options, onChange, placeholder = "Select…" }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  // Close when clicking anywhere outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") return setOpen(false);
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) e.preventDefault();
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) openList();
      return;
    }
    if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    if ((e.key === "Enter" || e.key === " ") && options[active]) choose(options[active]);
  };

  return (
    <div className="block" ref={rootRef}>
      <span className="field-label">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={
            "field flex items-center justify-between text-left " +
            (open ? "border-primary/60 ring-2 ring-primary/30" : "")
          }
        >
          <span className={selected ? "" : "text-base-content/30"}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
              "h-4 w-4 text-base-content/50 transition-transform " +
              (open ? "rotate-180" : "")
            }
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-btn border border-white/10 bg-base-200 p-1 shadow-2xl shadow-black/50 animate-fade-up [animation-duration:150ms]"
          >
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-base-content/40">Loading…</li>
            )}
            {options.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  className={
                    "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[15px] transition " +
                    (i === active ? "bg-white/5 " : "") +
                    (isSelected ? "font-medium text-primary" : "text-base-content/80")
                  }
                >
                  {option.label}
                  {isSelected && <Icon name="check" className="h-4 w-4" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
