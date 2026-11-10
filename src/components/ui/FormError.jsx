const FormError = ({ message }) =>
  message ? (
    <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
      {String(message)}
    </div>
  ) : null;

export default FormError;
