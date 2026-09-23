import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import * as taskApi from '../../api/taskApi';
import * as projectApi from '../../api/projectApi';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import { PRIORITY_LABEL, STATUS_COLUMNS } from '../../utils/constants';

export default function TaskDetailModal({ taskId, isOpen, onClose, onUpdated, onDeleted }) {
  const { projectId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || !taskId) return;
    setLoading(true);
    Promise.all([
      taskApi.getTask(projectId, taskId),
      taskApi.getComments(projectId, taskId),
      projectApi.getProjectMembers(projectId),
    ])
      .then(([taskRes, commentsRes, membersRes]) => {
        setTask(taskRes.data.task);
        setComments(commentsRes.data.comments);
        setMembers(membersRes.data.members);
      })
      .finally(() => setLoading(false));
  }, [isOpen, taskId, projectId]);

  const handleFieldChange = async (field, value) => {
    // Status changes go through the dedicated status endpoint - it's the one that
    // records status history and triggers the Kanban column move; the generic
    // update endpoint intentionally doesn't accept status changes.
    const res =
      field === 'status'
        ? await taskApi.updateTaskStatus(projectId, taskId, { status: value })
        : await taskApi.updateTask(projectId, taskId, { [field]: value });

    setTask(res.data.task);
    onUpdated?.(res.data.task);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setPosting(true);
    try {
      const res = await taskApi.createComment(projectId, taskId, { body: commentBody });
      setComments([...comments, res.data.comment]);
      setCommentBody('');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This can\'t be undone.')) return;
    setDeleting(true);
    try {
      await taskApi.archiveTask(projectId, taskId);
      onDeleted?.(taskId);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task?.code || 'Task'} width="max-w-2xl">
      {loading || !task ? (
        <div className="flex justify-center py-12">
          <Spinner size={24} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <input
              className="w-full bg-transparent font-display text-lg font-medium text-slate-100 focus:outline-none"
              defaultValue={task.title}
              onBlur={(e) => e.target.value !== task.title && handleFieldChange('title', e.target.value)}
            />
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete task"
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-status-blocked/30 bg-status-blocked/10 px-2.5 py-1.5 text-xs text-status-blocked hover:bg-status-blocked/20 disabled:opacity-50"
            >
              <Trash2 size={13} />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-md border border-ink-600 p-3 text-sm">
            <div>
              <p className="mb-1 text-xs text-slate-500">Status</p>
              <select
                className="w-full rounded-sm bg-ink-700 px-2 py-1 text-slate-200"
                value={task.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                {STATUS_COLUMNS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1 text-xs text-slate-500">Priority</p>
              <select
                className="w-full rounded-sm bg-ink-700 px-2 py-1 text-slate-200"
                value={task.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
              >
                {Object.entries(PRIORITY_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <p className="mb-1 text-xs text-slate-500">Assignee</p>
              <select
                className="w-full rounded-sm bg-ink-700 px-2 py-1 text-slate-200"
                value={task.assignees?.[0]?._id || ''}
                onChange={(e) =>
                  handleFieldChange('assignees', e.target.value ? [e.target.value] : [])
                }
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs text-slate-500">Description</p>
            <textarea
              className="w-full rounded-md border border-ink-600 bg-ink-800 p-2.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
              rows={4}
              defaultValue={task.description}
              placeholder="Add a description…"
              onBlur={(e) =>
                e.target.value !== task.description && handleFieldChange('description', e.target.value)
              }
            />
          </div>

          {task.type === 'bug' && task.issueDetails && (
            <div className="rounded-md border border-status-blocked/30 bg-status-blocked/5 p-3 text-sm">
              <p className="mb-1 font-medium text-status-blocked">Bug details</p>
              {task.issueDetails.severity && (
                <p className="text-slate-300">Severity: {task.issueDetails.severity}</p>
              )}
              {task.issueDetails.stepsToReproduce && (
                <p className="mt-1 text-slate-300">Steps: {task.issueDetails.stepsToReproduce}</p>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs text-slate-500">
              Comments <span className="text-slate-600">({comments.length})</span>
            </p>
            <div className="mb-3 max-h-48 space-y-3 overflow-y-auto scrollbar-thin">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-2.5">
                  <Avatar name={c.author?.name} size={24} />
                  <div className="flex-1 rounded-md bg-ink-700/50 px-3 py-2">
                    <div className="mb-0.5 flex items-baseline gap-2">
                      <span className="text-xs font-medium text-slate-200">{c.author?.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{c.body}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-slate-500">No comments yet.</p>}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                className="flex-1 rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                placeholder="Write a comment…"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
              <button
                type="submit"
                disabled={posting}
                className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-ink-950 hover:bg-amber-400 disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
