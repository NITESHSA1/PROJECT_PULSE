import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Activity, LogOut } from 'lucide-react';
import * as orgApi from '../../api/orgApi';
import { useAuth } from '../../hooks/useAuth';
import { useOrg } from '../../hooks/useOrg';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

export default function OrgList() {
  const { user, logout } = useAuth();
  const { selectOrg } = useOrg();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    orgApi
      .getMyOrganizations()
      .then((res) => setOrgs(res.data.organizations))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await orgApi.createOrganization(form);
      setModalOpen(false);
      setForm({ name: '', description: '' });
      goToOrg(res.data.organization);
    } finally {
      setCreating(false);
    }
  };

  const goToOrg = (org) => {
    selectOrg(org);
    navigate(`/orgs/${org._id}/projects`);
  };''

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
            <h1 className="font-display text-2xl font-semibold text-slate-100">Your organizations</h1>
            <p className="mt-1 text-sm text-slate-400">Pick a workspace or create a new one.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> New organization
            </span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={24} />
          </div>
        ) : orgs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-600 py-16 text-center">
            <p className="text-slate-400">No organizations yet.</p>
            <p className="mt-1 text-sm text-slate-500">Create one to start tracking projects.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orgs.map((org) => (
              <button
                key={org._id}
                onClick={() => goToOrg(org)}
                className="flex w-full items-center justify-between rounded-lg border border-ink-700 bg-ink-800 px-5 py-4 text-left transition-colors hover:border-ink-500"
              >
                <div>
                  <p className="font-display font-medium text-slate-100">{org.name}</p>
                  {org.description && <p className="text-sm text-slate-400">{org.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-ink-700 px-2 py-0.5 text-xs capitalize text-slate-300">
                    {org.myRole?.replace('_', ' ')}
                  </span>
                  <ChevronRight size={16} className="text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New organization">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Organization name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Acme Inc."
          />
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this org work on?"
          />
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? 'Creating ⟳' : 'Create organization'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
