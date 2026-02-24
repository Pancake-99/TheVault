import api from '../api'

// Obtener todas las credenciales del usuario → GET /credentials
export async function obtenerCredenciales() {
  const res = await api.get('/credentials')
  return res.data
}

// Obtener una credencial por ID → GET /credentials/:id
export async function obtenerCredencial(id) {
  const res = await api.get(`/credentials/${id}`)
  return res.data
}

// Crear credencial → POST /credentials
export async function crearCredencial(datos) {
  const res = await api.post('/credentials', datos)
  return res.data
}

// Actualizar credencial → PUT /credentials/:id
export async function actualizarCredencial(id, datos) {
  const res = await api.put(`/credentials/${id}`, datos)
  return res.data
}

// Eliminar credencial → DELETE /credentials/:id
export async function eliminarCredencial(id) {
  const res = await api.delete(`/credentials/${id}`)
  return res.data
}
