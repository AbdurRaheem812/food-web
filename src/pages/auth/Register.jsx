import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'CUSTOMER',
  });
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
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
        <p className="text-white/50 mb-6">Join FoodHub in seconds</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
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
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone number (optional)"
            value={form.phoneNumber}
            onChange={handleChange}
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />

          {/* Role toggle */}
          <div className="flex gap-3 mt-1">
            {['CUSTOMER', 'OWNER'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-3 rounded-full text-sm font-medium border transition-colors ${
                  form.role === r
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {r === 'CUSTOMER' ? "I'm hungry" : "I'm a restaurant owner"}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-white/50 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-400 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;