import * as Yup from 'yup';

export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number')
    .notRequired(),
  address: Yup.string()
    .min(5, 'Address seems too short')
    .notRequired(),
  role: Yup.string()
    .oneOf(['CUSTOMER', 'OWNER'], 'Invalid role')
    .required(),
});