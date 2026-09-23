import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass flex h-14 shrink-0 items-center justify-between border-b border-ink-700 px-6">
      <h1 className="font-display text-sm font-medium tracking-wide text-slate-200">{title}</h1>
      <div className="flex items-center gap-3">
        <Avatar name={user?.name} size={26} />
        <button
          onClick={handleLogout}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-ink-800 hover:text-status-blocked"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
