import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../validation/registerSchema';
import { FieldError } from '../../components/form/FieldError';

const inputClass =
  'bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors w-full';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      role: 'CUSTOMER',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        await register(values);
        navigate('/login', { state: { registered: true } });
      } catch (err) {
        setServerError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
        <p className="text-white/50 mb-6">Join FoodHub in seconds</p>

        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-1" noValidate>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={inputClass}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.username} error={formik.errors.username} />

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
            placeholder="Password (min 6 characters)"
            className={inputClass}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.password} error={formik.errors.password} />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone number (optional)"
            className={inputClass}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.phoneNumber} error={formik.errors.phoneNumber} />

          <input
            type="text"
            name="address"
            placeholder="Delivery address (optional)"
            className={inputClass}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldError touched={formik.touched.address} error={formik.errors.address} />

          {/* Role toggle */}
          <div className="flex gap-3 mt-2 mb-1">
            {['CUSTOMER', 'OWNER'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => formik.setFieldValue('role', r)}
                className={`flex-1 py-3 rounded-full text-sm font-medium border transition-colors ${
                  formik.values.role === r
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
            disabled={formik.isSubmitting}
            className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Sign Up'}
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