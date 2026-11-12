const FormError = ({ message }) =>
  message ? (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error animate-fade-up"
    >
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <span className="leading-relaxed">{String(message)}</span>
    </div>
  ) : null;

export default FormError;
