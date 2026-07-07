import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/authContext.js';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({ email, password });
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-pad grid place-items-center bg-ink px-4">
      <form className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-6" onSubmit={handleSubmit}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink">
          <LockKeyhole size={21} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">Sign in to upload, edit, feature, and remove portfolio work.</p>

        {error && <p className="mt-5 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}

        <label className="field-label mt-6">
          Email
          <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="field-label mt-4">
          Password
          <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="btn-primary mt-6 w-full justify-center" type="submit" disabled={submitting}>
          <LogIn size={18} />
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
