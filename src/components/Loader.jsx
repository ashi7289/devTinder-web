const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-32">
      <span className="loading loading-ring loading-lg text-primary"></span>
      <span className="font-mono text-xs text-base-content/40">
        loading<span className="animate-pulse">_</span>
      </span>
    </div>
  );
};
export default Loader;
