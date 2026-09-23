import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size={28} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
