import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../validation/loginSchema';

const inputClass =
  'bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors w-full';

const FieldError = ({ touched, error }) =>
  touched && error ? <p className="text-red-400 text-xs px-2 mb-2">{error}</p> : null;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const user = await login(values.email, values.password);
        navigate(user.roles.includes('OWNER') ? '/owner/orders' : '/');
      } catch (err) {
        setServerError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-white/50 mb-6">Log in to continue ordering</p>

        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-1" noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={inputClass}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.email} error={formik.errors.email} />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={inputClass}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.password} error={formik.errors.password} />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            {formik.isSubmitting ? 'Logging in...' : 'Log In'}
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