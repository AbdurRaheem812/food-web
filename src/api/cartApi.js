import axiosInstance from './axiosInstance';

export const getCart = async () => {
  const res = await axiosInstance.get('/cart');
  return res.data.data;
};

export const addToCart = async (menuItemId, quantity = 1, replaceCart = false) => {
  const res = await axiosInstance.post('/cart/items', { menuItemId, quantity, replaceCart });
  return res.data.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const res = await axiosInstance.patch(`/cart/items/${cartItemId}`, { quantity });
  return res.data.data;
};

export const removeCartItem = async (cartItemId) => {
  const res = await axiosInstance.delete(`/cart/items/${cartItemId}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete('/cart');
  return res.data;
};