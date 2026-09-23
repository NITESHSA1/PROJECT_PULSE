export default function Spinner({ size = 20, className = '' }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-ink-600 border-t-amber-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
