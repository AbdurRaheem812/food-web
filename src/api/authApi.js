import axiosInstance from './axiosInstance';

export const updateProfile = async (data) => {
  const res = await axiosInstance.patch('/auth/me', data);
  return res.data.data.user;
};

export const deactivateAccount = async () => {
  const res = await axiosInstance.post('/auth/me/deactivate');
  return res.data;
};

export const deleteAccountPermanently = async () => {
  const res = await axiosInstance.delete('/auth/me');
  return res.data;
};