import axiosInstance from './axiosInstance';

export const getCategories = async (restaurantId) => {
  const res = await axiosInstance.get(`/restaurants/${restaurantId}/categories`);
  return res.data.data.categories;
};

export const createCategory = async (restaurantId, name) => {
  const res = await axiosInstance.post(`/restaurants/${restaurantId}/categories`, { name });
  return res.data.data.category;
};

export const getMenuItems = async (restaurantId) => {
  const res = await axiosInstance.get(`/restaurants/${restaurantId}/menu-items`);
  return res.data.data.items;
};

export const createMenuItem = async (restaurantId, payload) => {
  const res = await axiosInstance.post(`/restaurants/${restaurantId}/menu-items`, payload);
  return res.data.data.item;
};

export const updateMenuItem = async (itemId, payload) => {
  const res = await axiosInstance.patch(`/menu-items/${itemId}`, payload);
  return res.data.data.item;
};

export const toggleMenuItemAvailability = async (itemId) => {
  const res = await axiosInstance.patch(`/menu-items/${itemId}/toggle-available`, {});
  return res.data.data.item;
};

export const uploadMenuItemImage = async (itemId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axiosInstance.post(`/menu-items/${itemId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.item;
};

export const deleteMenuItem = async (itemId) => {
  const res = await axiosInstance.delete(`/menu-items/${itemId}`);
  return res.data.data;
};