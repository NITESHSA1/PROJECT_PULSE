import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Flag } from 'lucide-react';
import * as projectApi from '../../api/projectApi';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const STATUS_COLOR = {
  upcoming: 'text-slate-400 border-ink-500',
  at_risk: 'text-priority-high border-priority-high/40',
  completed: 'text-status-done border-status-done/40',
  missed: 'text-status-blocked border-status-blocked/40',
};

export default function TimelinePage() {
  const { projectId } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    projectApi
      .getMilestones(projectId)
      .then((res) => setMilestones(res.data.milestones))
      .finally(() => setLoading(false));
  };

  useEffect(load, [projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await projectApi.createMilestone(projectId, form);
      setModalOpen(false);
      setForm({ title: '', description: '', dueDate: '' });
      load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-slate-100">Milestones</h2>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={14} /> Milestone
            </span>
          </Button>
        </div>

        {milestones.length === 0 ? (
          <p className="text-sm text-slate-500">No milestones yet.</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m._id}
                className={`flex items-start gap-3 rounded-lg border bg-ink-800/40 p-4 ${STATUS_COLOR[m.status]}`}
              >
                <Flag size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-medium text-slate-100">{m.title}</p>
                    <span className="text-xs text-slate-500">
                      {new Date(m.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {m.description && <p className="mt-1 text-sm text-slate-400">{m.description}</p>}
                  <span className="mt-2 inline-block text-xs capitalize">{m.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New milestone">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Due date"
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Creating…' : 'Create milestone'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
