import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Copy, Check } from 'lucide-react';
import * as orgApi from '../../api/orgApi';
import * as projectApi from '../../api/projectApi';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { ORG_ROLE_LABEL } from '../../utils/constants';

const PROJECT_ROLES = ['project_manager', 'team_lead', 'member', 'stakeholder'];
const PROJECT_ROLE_LABEL = {
  project_manager: 'Project Manager',
  team_lead: 'Team Lead',
  member: 'Member',
  stakeholder: 'Stakeholder',
};

export default function TeamPage() {
  const { orgId, projectId } = useParams();
  const [orgMembers, setOrgMembers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member' });
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ userId: '', role: 'member' });
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([orgApi.getOrganizationMembers(orgId), projectApi.getProjectMembers(projectId)])
      .then(([orgRes, projRes]) => {
        setOrgMembers(orgRes.data.members);
        setProjectMembers(projRes.data.members);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [orgId, projectId]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await orgApi.inviteMember(orgId, inviteForm);
      setInviteLink(res.data.inviteLink);
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const closeInviteModal = () => {
    setInviteModal(false);
    setInviteForm({ email: '', role: 'member' });
    setInviteLink('');
  };

  const handleAddToProject = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await projectApi.addProjectMember(projectId, addForm);
      setAddModal(false);
      setAddForm({ userId: '', role: 'member' });
      load();
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  const projectMemberUserIds = new Set(projectMembers.map((m) => m.user._id));
  const availableToAdd = orgMembers.filter((m) => !projectMemberUserIds.has(m.user._id));

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Project members */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium text-slate-100">Project team</h2>
              <p className="text-sm text-slate-500">
                People here can see the board, create tasks, and comment.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setAddModal(true)}>
              Add existing member
            </Button>
          </div>
          <div className="space-y-2">
            {projectMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-800/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={m.user.name} size={28} />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{m.user.name}</p>
                    <p className="text-xs text-slate-500">{m.user.email}</p>
                  </div>
                </div>
                <span className="rounded-sm bg-ink-700 px-2 py-0.5 text-xs text-slate-300">
                  {PROJECT_ROLE_LABEL[m.role]}
                </span>
              </div>
            ))}
            {projectMembers.length === 0 && (
              <p className="text-sm text-slate-500">No project members yet.</p>
            )}
          </div>
        </div>

        {/* Org members / invite */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-medium text-slate-100">Organization members</h2>
              <p className="text-sm text-slate-500">
                Invite someone new, then add them to this project above.
              </p>
            </div>
            <Button size="sm" onClick={() => setInviteModal(true)}>
              <span className="flex items-center gap-1.5">
                <UserPlus size={14} /> Invite
              </span>
            </Button>
          </div>
          <div className="space-y-2">
            {orgMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-800/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={m.user.name} size={28} />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{m.user.name}</p>
                    <p className="text-xs text-slate-500">{m.user.email}</p>
                  </div>
                </div>
                <span className="rounded-sm bg-ink-700 px-2 py-0.5 text-xs text-slate-300">
                  {ORG_ROLE_LABEL[m.role]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite modal */}
      <Modal isOpen={inviteModal} onClose={closeInviteModal} title="Invite to organization">
        {!inviteLink ? (
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="teammate@company.com"
            />
            <label className="block">
              <span className="mb-1.5 block text-sm text-slate-300">Role</span>
              <select
                className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                {Object.entries(ORG_ROLE_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" className="w-full" disabled={inviting}>
              {inviting ? 'Sending…' : 'Create invite link'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Share this link with <span className="font-medium text-slate-100">{inviteForm.email}</span> —
              there's no email service configured, so send it directly (chat, email, etc).
            </p>
            <div className="flex items-center gap-2 rounded-md border border-ink-600 bg-ink-800 px-3 py-2">
              <span className="flex-1 truncate text-xs text-slate-400">{inviteLink}</span>
              <button onClick={handleCopyLink} className="shrink-0 text-slate-400 hover:text-slate-100">
                {copied ? <Check size={14} className="text-status-done" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              They'll need to sign up or log in with this exact email, then open the link to join.
            </p>
            <Button variant="secondary" className="w-full" onClick={closeInviteModal}>
              Done
            </Button>
          </div>
        )}
      </Modal>

      {/* Add existing org member to project modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add to project">
        <form onSubmit={handleAddToProject} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-slate-300">Member</span>
            <select
              required
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100"
              value={addForm.userId}
              onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
            >
              <option value="">Select a member…</option>
              {availableToAdd.map((m) => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.name} ({m.user.email})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-slate-300">Project role</span>
            <select
              className="w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-slate-100"
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
            >
              {PROJECT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {PROJECT_ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>
          {availableToAdd.length === 0 && (
            <p className="text-xs text-slate-500">
              Everyone in the organization is already on this project. Invite someone new above.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={adding || availableToAdd.length === 0}>
            {adding ? 'Adding…' : 'Add to project'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
