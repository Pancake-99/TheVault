import api from '../api'

// Iniciar sesión → POST /auth/login
export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  return res.data // { token, ... }
}

// Registrar usuario → POST /auth/register
export async function register(datos) {
  const res = await api.post('/auth/register', datos)
  return res.data
}
