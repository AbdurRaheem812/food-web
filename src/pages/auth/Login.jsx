import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const roles = user.roles;
      if (roles.includes('OWNER')) navigate('/owner/onboarding');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-white/50 mb-6">Log in to continue ordering</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-white/50 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 hover:text-orange-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;