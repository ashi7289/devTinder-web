// A small "this browser was logged in" note, readable without a server call.
// It only decides whether to ask the server; the server still checks the token,
// so faking it does not log anyone in.
const KEY = "isLoggedIn";

export const hasLoginHint = () => {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    // storage blocked (private mode etc.) → fall back to asking the server
    return true;
  }
};

export const setLoginHint = (loggedIn) => {
  try {
    if (loggedIn) localStorage.setItem(KEY, "true");
    else localStorage.removeItem(KEY);
  } catch {
    // ignore: we just ask the server next time
  }
};
