const PageHeader = ({ title, subtitle, count, children }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="page-title flex items-center gap-3">
        {title}
        {count !== undefined && (
          <span className="grid h-8 min-w-8 place-items-center rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 text-base font-bold leading-none text-white">
            {count}
          </span>
        )}
      </h1>
      {subtitle && <p className="mt-1 text-base-content/60">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default PageHeader;
