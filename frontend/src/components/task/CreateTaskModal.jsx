import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as taskApi from '../../api/taskApi';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function CreateTaskModal({ isOpen, onClose, initialStatus, onCreated }) {
  const { projectId } = useParams();
  const [form, setForm] = useState({ title: '', type: 'task', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await taskApi.createTask(projectId, form);
      if (initialStatus && initialStatus !== 'backlog') {
        await taskApi.updateTaskStatus(projectId, res.data.task._id, { status: initialStatus });
        res.data.task.status = initialStatus;
      }
      onCreated(res.data.task);
      setForm({ title: '', type: 'task', priority: 'medium' });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          required
          autoFocus
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="What needs to be done?"
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm text-slate-300">Type</span>
            <select
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="story">Story</option>
              <option value="epic">Epic</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-slate-300">Priority</span>
            <select
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="lowest">Lowest</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="highest">Highest</option>
            </select>
          </label>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Creating…' : 'Create task'}
        </Button>
      </form>
    </Modal>
  );
}
