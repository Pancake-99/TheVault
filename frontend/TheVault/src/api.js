import axios from 'axios'

// Instancia de axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://146.235.242.100:3000/', // URL base del backend (sin prefijo /api)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adjuntar el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
