import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutGrid,
  ListTodo,
  GanttChartSquare,
  Users,
  UserCog,
  Activity as ActivityIcon,
  ArrowLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: 'board', label: 'Board', icon: LayoutGrid },
  { to: 'backlog', label: 'Backlog', icon: ListTodo },
  { to: 'timeline', label: 'Timeline', icon: GanttChartSquare },
  { to: 'workload', label: 'Workload', icon: Users },
  { to: 'team', label: 'Team', icon: UserCog },
  { to: 'activity', label: 'Activity', icon: ActivityIcon },
];

export default function Sidebar({ project }) {
  const { orgId } = useParams();

  return (
    <aside className="glass flex h-full w-56 shrink-0 flex-col border-r border-ink-700">
      <div className="border-b border-ink-700 px-4 py-4">
        <a
          href={`/orgs/${orgId}/projects`}
          className="mb-3 flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-neon-cyan"
        >
          <ArrowLeft size={12} /> All projects
        </a>
        <p className="truncate font-display text-sm font-semibold text-slate-100">
          {project?.name || 'Loading…'}
        </p>
        <p className="font-mono text-xs text-slate-500">{project?.key}</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-ink-700/80 text-neon-cyan shadow-glow-sm'
                  : 'text-slate-400 hover:bg-ink-800 hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(45,226,230,0.8)]" />
                )}
                <Icon size={16} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
