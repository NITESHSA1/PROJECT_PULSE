import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Activity, LogOut, ChevronRight } from 'lucide-react';
import * as orgApi from '../../api/orgApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

const STATUS_LABEL = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On hold',
  completed: 'Completed',
  archived: 'Archived',
};

export default function ProjectList() {
  const { orgId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', key: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    orgApi
      .getProjectsForOrg(orgId)
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  };

  useEffect(load, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const res = await orgApi.createProject(orgId, form);
      setModalOpen(false);
      setForm({ name: '', key: '', description: '' });
      navigate(`/orgs/${orgId}/projects/${res.data.project._id}/board`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="flex items-center justify-between border-b border-ink-700 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500">
            <Activity size={16} className="text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-semibold text-slate-100">ProjectPulse</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{user?.name}</span>
          <button onClick={logout} className="text-slate-400 hover:text-slate-100">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-slate-100">Projects</h1>
            <p className="mt-1 text-sm text-slate-400">Pick a project or start a new one.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> New project
            </span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-600 py-16 text-center">
            <p className="text-slate-400">No projects yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <button
                key={p._id}
                onClick={() => navigate(`/orgs/${orgId}/projects/${p._id}/board`)}
                className="flex w-full items-center justify-between rounded-lg border border-ink-700 bg-ink-800 px-5 py-4 text-left transition-colors hover:border-ink-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-700 font-display text-xs font-semibold text-slate-300">
                    {p.key}
                  </div>
                  <div>
                    <p className="font-display font-medium text-slate-100">{p.name}</p>
                    {p.description && <p className="text-sm text-slate-400">{p.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-ink-700 px-2 py-0.5 text-xs text-slate-300">
                    {STATUS_LABEL[p.status]}
                  </span>
                  <ChevronRight size={16} className="text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Website Redesign"
          />
          <Input
            label="Key"
            required
            maxLength={6}
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase() })}
            placeholder="e.g. WEB (used in task codes like WEB-1)"
          />
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {error && <p className="text-sm text-status-blocked">{error}</p>}
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? 'Creating…' : 'Create project'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
