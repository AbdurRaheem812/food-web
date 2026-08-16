import axiosInstance from './axiosInstance';

export const createReview = async (orderId, rating, comment) => {
  const res = await axiosInstance.post(`/orders/${orderId}/review`, { rating, comment });
  return res.data.data.review;
};

export const getRestaurantReviews = async (restaurantId) => {
  const res = await axiosInstance.get(`/restaurants/${restaurantId}/reviews`);
  return res.data.data;
};