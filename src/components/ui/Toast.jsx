import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Icon from "./Icon";

// App-wide toasts. Lives above the router so a toast survives page changes
// (e.g. "Welcome back!" after login redirects to the feed).
const ToastContext = createContext(null);

const DURATION = 4000;
const EXIT_MS = 300; // matches the slide-out-right animation

const STYLES = {
  success: { icon: "check", className: "border-success/30 text-success" },
  error: { icon: "x", className: "border-error/30 text-error" },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  // Play the slide-out first, then remove it once the animation is done
  const dismiss = useCallback((id) => {
    setToasts((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const show = useCallback(
    (type, message) => {
      if (!message) return;
      const id = ++nextId.current;
      // Same message twice in a row (double click) → keep just one
      setToasts((list) => [
        ...list.filter((t) => t.message !== message),
        { id, type, message },
      ]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (msg) => show("success", msg),
      error: (msg) => show("error", msg),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="toast toast-top toast-end z-[100] w-full max-w-sm overflow-x-hidden"
        aria-live="polite"
      >
        {toasts.map(({ id, type, message, leaving }) => (
          <div
            key={id}
            role={type === "error" ? "alert" : "status"}
            className={`alert flex items-start gap-3 bg-base-200 text-sm shadow-2xl ${
              leaving ? "animate-slide-out-right" : "animate-slide-in-right"
            } ${STYLES[type].className}`}
          >
            <Icon name={STYLES[type].icon} className="mt-0.5 h-5 w-5 shrink-0" />
            <span className="flex-1 text-left leading-relaxed">{message}</span>
            <button
              type="button"
              onClick={() => dismiss(id)}
              className="shrink-0 opacity-60 transition hover:opacity-100"
              aria-label="Dismiss"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
