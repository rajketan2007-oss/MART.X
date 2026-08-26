import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('extrad_user')
      ? JSON.parse(localStorage.getItem('extrad_user'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const loginApi = (data) => API.post('/auth/login', data);
export const registerApi = (data) => API.post('/auth/register', data);
export const getMeApi = () => API.get('/auth/me');

// User Profile & Address API
export const updateProfileApi = (data) => API.put('/users/profile', data);
export const addAddressApi = (data) => API.post('/users/addresses', data);
export const updateAddressApi = (id, data) => API.put(`/users/addresses/${id}`, data);
export const deleteAddressApi = (id) => API.delete(`/users/addresses/${id}`);

// Categories API
export const fetchCategoriesApi = () => API.get('/categories');
export const createCategoryApi = (data) => API.post('/categories', data);

// Products API
export const fetchProductsApi = (params) => API.get('/products', { params });
export const fetchProductByIdApi = (id) => API.get(`/products/${id}`);
export const fetchAutosuggestionsApi = (query) => API.get('/products/search/suggest', { params: { q: query } });
export const createProductApi = (data) => API.post('/products', data);
export const updateProductApi = (id, data) => API.put(`/products/${id}`, data);
export const deleteProductApi = (id) => API.delete(`/products/${id}`);

// Cart API
export const fetchCartApi = () => API.get('/cart');
export const addToCartApi = (data) => API.post('/cart', data);
export const updateCartItemApi = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeFromCartApi = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCartApi = () => API.delete('/cart');

// Wishlist API
export const fetchWishlistApi = () => API.get('/wishlist');
export const toggleWishlistApi = (productId) => API.post('/wishlist/toggle', { productId });
export const removeFromWishlistApi = (productId) => API.delete(`/wishlist/${productId}`);

// Coupons API
export const fetchCouponsApi = () => API.get('/coupons');
export const validateCouponApi = (data) => API.post('/coupons/validate', data);
export const createCouponApi = (data) => API.post('/coupons/admin', data);
export const deleteCouponApi = (id) => API.delete(`/coupons/admin/${id}`);

// Orders API
export const createOrderApi = (data) => API.post('/orders', data);
export const fetchMyOrdersApi = () => API.get('/orders/myorders');
export const fetchOrderByIdApi = (id) => API.get(`/orders/${id}`);
export const fetchAllOrdersAdminApi = () => API.get('/orders/admin/all');
export const updateOrderStatusAdminApi = (id, orderStatus) => API.put(`/orders/admin/${id}/status`, { orderStatus });

// Reviews API
export const createReviewApi = (data) => API.post('/reviews', data);
export const fetchProductReviewsApi = (productId) => API.get(`/reviews/product/${productId}`);

// Admin Stats & Users API
export const fetchAdminStatsApi = () => API.get('/admin/stats');
export const fetchAdminUsersApi = () => API.get('/admin/users');
export const deleteAdminUserApi = (id) => API.delete(`/admin/users/${id}`);

export default API;
