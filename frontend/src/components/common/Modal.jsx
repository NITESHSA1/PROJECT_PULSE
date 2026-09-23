import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`glass relative w-full ${width} animate-[fadeIn_0.15s_ease] rounded-lg border border-ink-600 shadow-glow-sm`}
      >
        <div className="flex items-center justify-between border-b border-ink-600 px-5 py-4">
          <h2 className="font-display text-base font-medium text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-ink-700 hover:text-neon-cyan"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5 scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}
