export default function Badge({ children, dotColor, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm bg-ink-700 px-2 py-0.5 text-xs text-slate-300 ${className}`}
    >
      {dotColor && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
