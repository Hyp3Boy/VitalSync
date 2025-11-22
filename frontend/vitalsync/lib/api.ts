import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aquí podrías añadir interceptors para el token de autorización en el futuro
// api.interceptors.request.use(...)

export default api;
