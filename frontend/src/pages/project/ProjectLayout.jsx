import { useEffect, useState } from 'react';
import { Outlet, useParams, useLocation, Link } from 'react-router-dom';
import * as projectApi from '../../api/projectApi';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Spinner from '../../components/common/Spinner';

const TITLES = {
  board: 'Board',
  backlog: 'Backlog',
  timeline: 'Timeline',
  workload: 'Workload',
  team: 'Team',
  activity: 'Activity',
};

export default function ProjectLayout() {
  const { orgId, projectId } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    projectApi
      .getProject(projectId)
      .then((res) => setProject(res.data.project))
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "You don't have access to this project yet. Ask the project admin to add you as a project member."
            : err.response?.data?.message || 'Failed to load this project.'
        );
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const segment = location.pathname.split('/').pop();
  const title = TITLES[segment] || project?.name || '';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-ink-900 px-4 text-center">
        <p className="max-w-sm text-sm text-status-blocked">{error}</p>
        <Link to={`/orgs/${orgId}/projects`} className="text-sm text-amber-400 hover:text-amber-300">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ink-900">
      <Sidebar project={project} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <Outlet context={{ project }} />
      </div>
    </div>
  );
}
