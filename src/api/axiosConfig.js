import axios from 'axios';

// Backend en Render: https://latiendaapi-1zrf.onrender.com
// Nota: el hosting gratuito de Render "duerme" la app después de 15 min sin tráfico,
// por eso la primera petición tras un periodo de inactividad puede tardar 30-60 segundos
// en responder (cold start). El timeout de abajo le da margen a ese primer arranque.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tiendaapi-9r64.onrender.com/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el JWT a cada peticion si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expira o es invalido (401), limpia sesion y manda al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;