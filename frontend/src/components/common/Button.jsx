const VARIANTS = {
  primary:
    'bg-gradient-brand text-ink-950 font-medium shadow-glow-sm hover:shadow-glow-cyan hover:brightness-110 active:brightness-95',
  secondary:
    'bg-ink-700/60 text-slate-100 border border-ink-600 hover:border-neon-cyan/50 hover:text-neon-cyan backdrop-blur-sm',
  ghost: 'text-slate-300 hover:bg-ink-800 hover:text-neon-cyan',
  danger:
    'bg-status-blocked/10 text-status-blocked hover:bg-status-blocked/20 border border-status-blocked/30 hover:shadow-[0_0_16px_rgba(248,113,113,0.25)]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';
  return (
    <button
      className={`${sizeClass} rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${VARIANTS[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
