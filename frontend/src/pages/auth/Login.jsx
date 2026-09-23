import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/orgs');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-brand shadow-glow-cyan">
            <Activity size={18} className="text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold text-slate-100">ProjectPulse</span>
        </div>

        <h1 className="mb-1 font-display text-2xl font-semibold text-slate-100">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-400">Sign in to your workspace.</p>

        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-lg border border-ink-700 p-6">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your Email here ✉"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password here 🔐"
          />
          {error && <p className="text-sm text-status-blocked">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in ⟳' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-cyan hover:text-neon-cyan/80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
