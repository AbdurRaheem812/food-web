import axiosInstance from './axiosInstance';

export const applyAsRestaurant = async (payload) => {
  const res = await axiosInstance.post('/restaurants/apply', payload);
  return res.data.data.restaurant;
};

export const uploadRestaurantLogo = async (restaurantId, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await axiosInstance.post(`/restaurants/${restaurantId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.restaurant;
};

export const getMyRestaurants = async () => {
  const res = await axiosInstance.get('/restaurants/me/restaurants');
  return res.data.data.restaurants;
};

export const updateRestaurant = async (restaurantId, payload) => {
  const res = await axiosInstance.patch(`/restaurants/${restaurantId}`, payload);
  return res.data.data.restaurant;
};

export const toggleRestaurantOpen = async (restaurantId) => {
  const res = await axiosInstance.patch(`/restaurants/${restaurantId}/toggle-open`, {});
  return res.data.data.restaurant;
};

export const getPublicRestaurants = async (params) => {
  const res = await axiosInstance.get('/restaurants', { params });
  return res.data.data;
};

export const getRestaurantById = async (id) => {
  const res = await axiosInstance.get(`/restaurants/${id}`);
  return res.data.data.restaurant;
};