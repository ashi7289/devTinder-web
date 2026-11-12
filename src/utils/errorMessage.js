// Turns any API / axios error into a short message that is safe to show users.
// The server sometimes sends raw DB errors (e.g. "ERROR : E11000 duplicate key ..."),
// so we translate the known ones and hide anything that looks technical.

const FIELD_LABELS = {
  emailId: "email",
  firstName: "first name",
  lastName: "last name",
  photoUrl: "photo",
  password: "password",
  age: "age",
  gender: "gender",
  about: "about",
  skills: "skills",
};

const label = (field) => FIELD_LABELS[field] || field;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Pull the message text out of whatever shape the server sent back
const extractRaw = (data) => {
  if (!data) return "";
  if (typeof data === "string") return data;
  return data.message || data.error || data.msg || "";
};

const translate = (raw) => {
  // "ERROR : something" / "Error: something" → "something"
  const msg = raw.replace(/^\s*error\s*:?\s*/i, "").trim();
  // Empty, or an HTML error page from a proxy / gateway
  if (!msg || msg.startsWith("<")) return "";

  // Mongo duplicate key: E11000 ... dup key: { emailId: "x" }
  if (/E11000|duplicate key/i.test(msg)) {
    const field = msg.match(/dup key:\s*\{\s*"?(\w+)"?\s*:/)?.[1];
    if (field === "emailId" || /email/i.test(msg))
      return "An account with this email already exists. Try logging in instead.";
    return field
      ? `This ${label(field)} is already taken.`
      : "This value is already taken.";
  }

  // Mongoose validation: "User validation failed: firstName: Path `firstName` is required., ..."
  if (/validation failed/i.test(msg)) {
    const parts = msg
      .replace(/^.*validation failed:\s*/i, "")
      .split(/,\s*(?=\w+:)/)
      .map((part) => {
        const [field, ...rest] = part.split(":");
        const detail = rest.join(":").trim();
        if (/is required/i.test(detail)) return `${capitalize(label(field.trim()))} is required`;
        if (/minimum allowed length/i.test(detail))
          return `${capitalize(label(field.trim()))} is too short`;
        if (/maximum allowed length/i.test(detail))
          return `${capitalize(label(field.trim()))} is too long`;
        // Custom validator messages are usually already readable
        return detail.replace(/Path `\w+`/g, capitalize(label(field.trim())));
      })
      .filter(Boolean);
    return parts.length ? parts.join(". ") + "." : "Please check the details you entered.";
  }

  // Mongo cast errors: "Cast to Number failed for value "abc" (type string) at path "age""
  if (/Cast to \w+ failed/i.test(msg)) {
    const field = msg.match(/at path "(\w+)"/)?.[1];
    return field
      ? `Please enter a valid ${label(field)}.`
      : "Some of the details you entered are invalid.";
  }

  // Anything else that still looks like internals should not reach the user
  if (/Mongo|ECONN|stack|TypeError|ReferenceError|undefined|null|\bat\s+\S+\s+\(/i.test(msg))
    return "";

  return msg;
};

export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  // Request never got a response: offline, server down, CORS, timeout
  if (err?.request && !err?.response) {
    if (err.code === "ECONNABORTED") return "The request timed out. Please try again.";
    return "Can't reach the server. Check your connection and try again.";
  }

  const status = err?.response?.status;
  const friendly = translate(extractRaw(err?.response?.data));
  if (friendly) return friendly;

  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 413) return "That file is too large.";
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Something went wrong on our end. Please try again shortly.";

  return fallback;
};

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
