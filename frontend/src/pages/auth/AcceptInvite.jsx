import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as orgApi from '../../api/orgApi';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending | accepting | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user || !token || status !== 'pending') return;
    setStatus('accepting');
    orgApi
      .acceptInvitation(token)
      .then((res) => {
        setStatus('success');
        setTimeout(() => navigate(`/orgs/${res.data.organization._id}/projects`), 1200);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to accept invitation');
        setStatus('error');
      });
  }, [authLoading, user, token, status, navigate]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size={28} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-ink-900 px-4 text-center">
        <p className="text-slate-300">Sign in to accept this invitation.</p>
        <Link to={`/login?redirect=/invitations/accept?token=${token}`}>
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-ink-900 px-4 text-center">
      {status === 'accepting' && (
        <>
          <Spinner size={28} />
          <p className="text-slate-300">Accepting invitation…</p>
        </>
      )}
      {status === 'success' && <p className="text-status-done">You're in! Redirecting…</p>}
      {status === 'error' && <p className="text-status-blocked">{error}</p>}
    </div>
  );
}
