import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as taskApi from '../../api/taskApi';
import * as projectApi from '../../api/projectApi';
import TaskDetailModal from '../../components/task/TaskDetailModal';
import Avatar from '../../components/common/Avatar';
import Spinner from '../../components/common/Spinner';
import { STATUS_DOT, PRIORITY_COLOR } from '../../utils/constants';

export default function BacklogPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      taskApi.getTasks(projectId, { limit: 200 }),
      projectApi.getSprints(projectId),
    ])
      .then(([taskRes, sprintRes]) => {
        setTasks(taskRes.data.tasks);
        setSprints(sprintRes.data.sprints);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  const unassigned = tasks.filter((t) => !t.sprint);

  const renderTaskRow = (task) => (
    <div
      key={task._id}
      onClick={() => setSelectedTaskId(task._id)}
      className="flex cursor-pointer items-center gap-3 border-b border-ink-700 px-4 py-2.5 hover:bg-ink-800/60"
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[task.status]}`} />
      <span className="w-16 shrink-0 font-mono text-xs text-slate-500">{task.code}</span>
      <span className="flex-1 truncate text-sm text-slate-200">{task.title}</span>
      {task.storyPoints != null && (
        <span className="rounded-sm bg-ink-700 px-1.5 py-0.5 text-[11px] text-slate-400">
          {task.storyPoints} pts
        </span>
      )}
      <span className={`h-1.5 w-4 rounded-full ${PRIORITY_COLOR[task.priority]}`} />
      {task.assignees?.[0] ? (
        <Avatar name={task.assignees[0].name} size={22} />
      ) : (
        <div className="h-[22px] w-[22px] rounded-full border border-dashed border-ink-500" />
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="mx-auto max-w-4xl space-y-8">
        {sprints.map((sprint) => {
          const sprintTasks = tasks.filter((t) => t.sprint === sprint._id);
          return (
            <div key={sprint._id} className="rounded-lg border border-ink-700 bg-ink-800/40">
              <div className="flex items-center justify-between border-b border-ink-700 px-4 py-3">
                <div>
                  <p className="font-display text-sm font-medium text-slate-100">{sprint.name}</p>
                  {sprint.goal && <p className="text-xs text-slate-500">{sprint.goal}</p>}
                </div>
                <span className="rounded-sm bg-ink-700 px-2 py-0.5 text-xs capitalize text-slate-300">
                  {sprint.status}
                </span>
              </div>
              {sprintTasks.length ? sprintTasks.map(renderTaskRow) : (
                <p className="px-4 py-3 text-sm text-slate-500">No tasks in this sprint yet.</p>
              )}
            </div>
          );
        })}

        <div className="rounded-lg border border-ink-700 bg-ink-800/40">
          <div className="border-b border-ink-700 px-4 py-3">
            <p className="font-display text-sm font-medium text-slate-100">Backlog</p>
          </div>
          {unassigned.length ? unassigned.map(renderTaskRow) : (
            <p className="px-4 py-3 text-sm text-slate-500">Backlog is empty.</p>
          )}
        </div>
      </div>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onUpdated={(updated) => setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))}
        onDeleted={(taskId) => setTasks((prev) => prev.filter((t) => t._id !== taskId))}
      />
    </div>
  );
}
