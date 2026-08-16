import axiosInstance from './axiosInstance';

export const getPendingApplications = async () => {
  const res = await axiosInstance.get('/admin/applications');
  return res.data.data.restaurants;
};

export const decideApplication = async (id, decision, reason) => {
  const res = await axiosInstance.patch(`/admin/applications/${id}`, { decision, reason });
  return res.data.data.restaurant;
};

export const getUsers = async (params) => {
  const res = await axiosInstance.get('/admin/users', { params });
  return res.data.data;
};

export const toggleUserBlock = async (id) => {
  const res = await axiosInstance.patch(`/admin/users/${id}/toggle-block`, {});
  return res.data.data.user;
};

export const getPlatformStats = async () => {
  const res = await axiosInstance.get('/admin/stats');
  return res.data.data.stats;
};