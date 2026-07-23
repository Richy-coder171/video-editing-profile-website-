import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/authContext.js';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';

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

  const getLoginErrorMessage = (requestError) => {
    if (!requestError.response) {
      return 'Cannot reach the API. Make sure the server is running on http://localhost:5000 and open the site from http://localhost:5173.';
    }

    return requestError.response.data?.message || 'Unable to log in';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({ email, password });
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-pad relative grid place-items-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute inset-0 bg-cinematic-sheen opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-manga-lines opacity-10" />
      <LazyPage3DAccent
        variant="admin"
        className="right-[-12rem] top-28 h-[24rem] w-[32rem] opacity-30 sm:right-[-7rem] sm:h-[30rem] sm:w-[39rem] sm:opacity-50 lg:right-[5vw] lg:top-32 lg:opacity-55"
      />
      <form className="anime-surface relative z-10 w-full max-w-md rounded-lg p-6 sm:p-8" onSubmit={handleSubmit}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-glow">
          <LockKeyhole size={21} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">Sign in to upload, edit, feature, and remove portfolio work.</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/55">
          <ShieldCheck size={14} className="text-electric" />
          Protected portfolio dashboard
        </p>

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
