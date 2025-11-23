import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const DEFAULT_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 2000);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
});

// BACKEND AUTH CONTRACT:
// When connecting to real backend, attach auth token from your store:
// api.interceptors.request.use((config) => {
//   const token = /* read from auth store */
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

export default api;
