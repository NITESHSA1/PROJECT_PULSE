import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as activityApi from '../../api/activityApi';
import Avatar from '../../components/common/Avatar';
import Spinner from '../../components/common/Spinner';

const ACTION_TEXT = {
  'project.created': 'created the project',
  'project.updated': 'updated the project',
  'sprint.created': 'created a sprint',
  'sprint.status_changed': 'changed sprint status',
  'milestone.created': 'created a milestone',
  'task.created': 'created a task',
  'task.updated': 'updated a task',
  'task.status_changed': 'moved a task',
  'comment.created': 'commented',
};

export default function ActivityPage() {
  const { projectId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    activityApi
      .getProjectActivity(projectId, { limit: 50 })
      .then((res) => setActivities(res.data.activities))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 font-display text-lg font-medium text-slate-100">Activity</h2>

        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div key={a._id} className="flex gap-3 border-b border-ink-700/60 py-3">
                <Avatar name={a.actor?.name} size={26} />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-100">{a.actor?.name}</span>{' '}
                    {ACTION_TEXT[a.action] || a.action}
                    {a.meta?.code && <span className="text-slate-400"> · {a.meta.code}</span>}
                    {a.meta?.from && a.meta?.to && (
                      <span className="text-slate-500">
                        {' '}
                        ({a.meta.from} ? {a.meta.to})
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
