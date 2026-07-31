import axiosInstance from './axiosInstance';

export const applyAsRestaurant = async (payload) => {
  const res = await axiosInstance.post('/restaurants/apply', payload);
  return res.data.data.restaurant;
};

export const uploadRestaurantLogo = async (file) => {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await axiosInstance.post('/restaurants/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.restaurant;
};

export const getMyApplicationStatus = async () => {
  const res = await axiosInstance.get('/restaurants/me/status');
  return res.data.data.restaurant;
};