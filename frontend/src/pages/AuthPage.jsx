import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/slices/authSlice';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (mode === 'login') {
      const res = await dispatch(login({ username: form.username, email: form.username, password: form.password }));
      if (!res.error) navigate(from, { replace: true });
    } else {
      const res = await dispatch(register(form));
      if (!res.error) navigate(from, { replace: true });
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setForm({ username: '', email: '', password: '' });
    dispatch(clearError());
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {mode === 'login' ? 'Username or Email' : 'Username'}
              </label>
              <input
                type={mode === 'login' ? 'text' : 'text'}
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                placeholder={mode === 'login' ? 'johndoe or john@example.com' : 'johndoe'}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                  placeholder="john@example.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                placeholder="••••••••"
              />
              <p className="text-xs text-slate-400 mt-1">
                Password must be at least 6 characters long, start with a capital letter, and contain at least one special symbol (e.g., @, #, $, !).
              </p>
            </div>

            {mode === 'login' && (
              <p className="text-sm text-slate-400">
                Login with username <strong>or</strong> email. Use the same field for both.
              </p>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-semibold transition-colors"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-slate-500 text-sm">
          <Link to="/" className="hover:text-slate-400">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
