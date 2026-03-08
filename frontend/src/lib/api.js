import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const moviesAPI = {
  getTrending: (page = 1) => api.get(`/movies/trending?page=${page}`),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  getTVTrending: (page = 1) => api.get(`/movies/tv/trending?page=${page}`),
  getTVPopular: (page = 1) => api.get(`/movies/tv/popular?page=${page}`),
  search: (query, page = 1) => api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
  searchMulti: (query, page = 1) => api.get(`/movies/search/multi?query=${encodeURIComponent(query)}&page=${page}`),
  getDetails: (id) => api.get(`/movies/${id}`),
  getTVDetails: (id) => api.get(`/movies/tv/${id}`),
  getPersonDetails: (id) => api.get(`/movies/person/${id}`),
  getTrailer: (id) => api.get(`/movies/${id}/trailer`),
  getTVTrailer: (id) => api.get(`/movies/tv/${id}/trailer`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (movieId) => api.delete(`/favorites/${movieId}`),
};

export const watchlistAPI = {
  getAll: () => api.get('/watchlist'),
  add: (data) => api.post('/watchlist', data),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
};

export const historyAPI = {
  getAll: () => api.get('/history'),
  add: (data) => api.post('/history', data),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  banUser: (id) => api.patch(`/admin/user/${id}/ban`),
  getMovies: () => api.get('/admin/movies'),
  addMovie: (data) => api.post('/admin/movies', data),
  updateMovie: (id, data) => api.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/admin/movies/${id}`),
};
