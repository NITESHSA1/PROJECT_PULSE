export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-slate-300">{label}</span>}
      <input
        className={`w-full rounded-md border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400/60 transition-colors duration-150 focus:border-neon-cyan focus:shadow-glow-sm focus:outline-none ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-status-blocked">{error}</span>}
    </label>
  );
}
