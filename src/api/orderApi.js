import axiosInstance from './axiosInstance';

export const createOrder = async (deliveryAddress) => {
  const res = await axiosInstance.post('/orders', { deliveryAddress });
  return res.data.data.order;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get('/orders/me');
  return res.data.data.orders;
};

export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`/orders/${id}`);
  return res.data.data.order;
};

export const updateOrderStatus = async (orderId, status, reason) => {
  const res = await axiosInstance.patch(`/orders/${orderId}/status`, { status, reason });
  return res.data.data.order;
};

export const getRestaurantOrders = async (restaurantId) => {
  const res = await axiosInstance.get(`/orders/restaurant/${restaurantId}`);
  return res.data.data.orders;
};

export const getAllOwnerOrders = async () => {
  const res = await axiosInstance.get('/orders/owner/all');
  return res.data.data.orders;
};