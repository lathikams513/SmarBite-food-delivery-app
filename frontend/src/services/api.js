import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApi = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/register', payload),
  requestRegisterOtp: (payload) => api.post('/register/request-otp', payload),
  verifyRegisterOtp: (payload) => api.post('/register/verify-otp', payload),
  requestLoginOtp: (payload) => api.post('/login/request-otp', payload),
  verifyLoginOtp: (payload) => api.post('/login/verify-otp', payload)
};

export const restaurantApi = {
  list: () => api.get('/restaurants'),
  menu: (restaurantId) => api.get(`/menu/${restaurantId}`)
};

export const orderApi = {
  cartPreview: (payload) => api.post('/cart/add', payload),
  place: (payload) => api.post('/order/place', payload),
  history: (userId) => api.get(`/orders/${userId}`),
  updateStatus: (payload) => api.put('/order/status', payload)
};

export const smartApi = {
  recommend: (userId) => api.get(`/recommend/${userId}`),
  budget: (payload) => api.post('/budget', payload),
  createGroup: (payload) => api.post('/group/create', payload),
  joinGroup: (payload) => api.post('/group/join', payload),
  getGroup: (groupCode) => api.get(`/group/${groupCode}`),
  addGroupItem: (payload) => api.post('/group/item', payload),
  updateGroupSplit: (payload) => api.put('/group/split', payload)
};

export default api;
