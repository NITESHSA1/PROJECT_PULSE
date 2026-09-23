import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as taskApi from '../../api/taskApi';
import * as projectApi from '../../api/projectApi';
import Avatar from '../../components/common/Avatar';
import Spinner from '../../components/common/Spinner';

export default function WorkloadPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      taskApi.getTasks(projectId, { limit: 500 }),
      projectApi.getProjectMembers(projectId),
    ])
      .then(([taskRes, memberRes]) => {
        setTasks(taskRes.data.tasks || []);
        setMembers(memberRes.data.members || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load workload'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-status-blocked">{error}</p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const overallPct = totalTasks === 0 ? 0 : Math.round((totalDone / totalTasks) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 font-display text-lg font-medium text-slate-100">Project completion</h2>
        <div className="mb-8 rounded-lg border border-ink-700 bg-ink-800/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-300">
              {totalDone} of {totalTasks} tasks done
            </span>
            <span className="font-display text-lg font-semibold text-amber-400">{overallPct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-status-done transition-all duration-300"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          {totalTasks === 0 && (
            <p className="mt-2 text-xs text-slate-500">Create some tasks to start tracking progress.</p>
          )}
        </div>

        <h2 className="mb-4 font-display text-lg font-medium text-slate-100">By team member</h2>
        <div className="space-y-3">
          {members.map((m) => {
            const memberTasks = tasks.filter((t) =>
              t.assignees?.some((a) => a._id === m.user._id)
            );
            const doneCount = memberTasks.filter((t) => t.status === 'done').length;
            const pct = memberTasks.length === 0 ? 0 : Math.round((doneCount / memberTasks.length) * 100);

            return (
              <div key={m._id} className="rounded-lg border border-ink-700 bg-ink-800/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.user.name} size={26} />
                    <span className="text-sm font-medium text-slate-200">{m.user.name}</span>
                    <span className="text-xs capitalize text-slate-500">{m.role.replace('_', ' ')}</span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {doneCount}/{memberTasks.length} · <span className="text-slate-200">{pct}%</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <p className="text-sm text-slate-500">
              No project members yet — add teammates from the Team tab.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
