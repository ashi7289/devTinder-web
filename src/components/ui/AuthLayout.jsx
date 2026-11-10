import Icon from "./Icon";

// Split screen used by Login and Signup: pitch on the left, form on the right
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:py-16">
    <section className="hidden animate-fade-up lg:block">
      <span className="chip mb-6 border-primary/30 bg-primary/10 text-primary">
        <Icon name="sparkles" className="h-3.5 w-3.5" />
        Built for developers
      </span>
      <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
        Find your next
        <br />
        <span className="text-gradient">pair-programming</span>
        <br />
        partner.
      </h1>
      <p className="mt-5 max-w-md text-lg text-base-content/60">
        Swipe through developers, match on shared interests, and start building
        together. Hackathon teams, side projects, mentors — all in one place.
      </p>

      {/* Fake terminal card for the dev vibe */}
      <div className="mt-10 max-w-md animate-float rounded-2xl border border-white/10 bg-base-200/80 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-error/80" />
          <span className="h-3 w-3 rounded-full bg-warning/80" />
          <span className="h-3 w-3 rounded-full bg-success/80" />
          <span className="ml-3 font-mono text-xs text-base-content/40">
            devTinder.js
          </span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
          <code>
            <span className="text-accent">const</span>{" "}
            <span className="text-info">devTinder</span> = {"{"}
            {"\n"}
            {"  "}builtFor: <span className="text-success">&quot;developers&quot;</span>,
            {"\n"}
            {"  "}features: [<span className="text-success">&quot;swipe&quot;</span>,{" "}
            <span className="text-success">&quot;match&quot;</span>,{" "}
            <span className="text-success">&quot;chat&quot;</span>],
            {"\n"}
            {"  "}realtime: <span className="text-warning">true</span>,
            {"\n"}
            {"}"};
            {"\n\n"}
            <span className="text-info">devTinder</span>.
            <span className="text-secondary">findYourTeam</span>();
            {"\n"}
            <span className="text-base-content/40">
              {"// ✓ swipe → match → build together 🚀"}
            </span>
          </code>
        </pre>
      </div>

      <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
        {[
          ["heart", "Swipe", "on dev profiles"],
          ["userPlus", "Match", "when it's mutual"],
          ["message", "Chat", "in real time"],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <Icon name={icon} className="mb-2 h-5 w-5 text-primary" />
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-base-content/50">{text}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto w-full max-w-md animate-fade-up">
      <div className="glass-card p-8 sm:p-10">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-base-content/60">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  </div>
);

export default AuthLayout;
