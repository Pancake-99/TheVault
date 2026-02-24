<template>
  <div class="credenciales-page">
    <!-- Barra de búsqueda -->
    <div class="toolbar">
      <div class="search-box">
        <input type="text" v-model="busqueda" placeholder="Buscar por nombre de servicio..." />
      </div>
      <router-link to="/credenciales/nueva" class="btn-nueva"> + Nueva Credencial </router-link>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="cargando">
      <span class="spinner"></span>
      <span>Cargando credenciales...</span>
    </div>

    <!-- Error al cargar -->
    <div v-else-if="errorCarga" class="error-banner">
      <span class="error-icon">⚠</span>
      <span>{{ errorCarga }}</span>
      <button class="btn-reintentar" @click="cargarCredenciales">Reintentar</button>
    </div>

    <!-- Tabla de credenciales -->
    <div v-else class="table-container">
      <table v-if="credencialesFiltradas.length">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Usuario / Email</th>
            <th>URL</th>
            <th>Última actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cred in credencialesFiltradas" :key="cred.id">
            <td class="col-servicio">{{ cred.servicio }}</td>
            <td>{{ cred.usuario }}</td>
            <td>
              <a v-if="cred.url" :href="cred.url" target="_blank" rel="noopener" class="link-url">
                {{ cred.url }}
              </a>
              <span v-else class="text-muted">—</span>
            </td>
            <td>{{ formatearFecha(cred.ultimaActualizacion || cred.updatedAt) }}</td>
            <td class="col-acciones">
              <button class="btn-accion btn-ver" @click="verDetalle(cred)" title="Ver detalle">
                👁 Ver
              </button>
              <button class="btn-accion btn-editar" @click="editarCredencial(cred)" title="Editar">
                ✏️ Editar
              </button>
              <button
                class="btn-accion btn-eliminar"
                @click="confirmarEliminar(cred)"
                title="Eliminar"
              >
                🗑 Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Sin resultados -->
      <div v-else class="sin-resultados">
        <p v-if="busqueda">No se encontraron credenciales para "{{ busqueda }}"</p>
        <p v-else>No hay credenciales guardadas aún.</p>
      </div>
    </div>

    <!-- Modal de detalle -->
    <div v-if="credencialSeleccionada" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ credencialSeleccionada.servicio }}</h3>
          <button class="btn-cerrar" @click="cerrarModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="detalle-row">
            <span class="detalle-label">Servicio:</span>
            <span>{{ credencialSeleccionada.servicio }}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Usuario / Email:</span>
            <span>{{ credencialSeleccionada.usuario }}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Contraseña:</span>
            <span class="contrasena-field">
              <code>{{ mostrandoPassword ? credencialSeleccionada.password : '••••••••••' }}</code>
              <button class="btn-toggle-pass" @click="togglePassword">
                {{ mostrandoPassword ? '🙈 Ocultar' : '👁 Mostrar' }}
              </button>
            </span>
          </div>
          <div class="detalle-row" v-if="credencialSeleccionada.url">
            <span class="detalle-label">URL:</span>
            <a :href="credencialSeleccionada.url" target="_blank" rel="noopener" class="link-url">
              {{ credencialSeleccionada.url }}
            </a>
          </div>
          <div class="detalle-row" v-if="credencialSeleccionada.notas">
            <span class="detalle-label">Notas:</span>
            <span class="detalle-notas">{{ credencialSeleccionada.notas }}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Última actualización:</span>
            <span>{{
              formatearFecha(
                credencialSeleccionada.ultimaActualizacion || credencialSeleccionada.updatedAt,
              )
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="modalEdicion" class="modal-overlay" @click.self="cerrarEdicion">
      <div class="modal modal-edicion">
        <div class="modal-header">
          <h3>✏️ Editar Credencial</h3>
          <button class="btn-cerrar" @click="cerrarEdicion">✕</button>
        </div>
        <div class="modal-body">
          <!-- Error del servidor -->
          <div v-if="errorEdicion" class="error-banner error-inline">
            <span class="error-icon">⚠</span>
            <span>{{ errorEdicion }}</span>
          </div>

          <form @submit.prevent="guardarEdicion" novalidate>
            <!-- Nombre de servicio -->
            <div class="form-group" :class="{ 'has-error': erroresEdicion.servicio }">
              <label for="edit-servicio">Nombre de servicio</label>
              <div class="input-wrapper">
                <input
                  id="edit-servicio"
                  type="text"
                  v-model="formEdicion.servicio"
                  placeholder="Ej: Netflix, GitHub..."
                  @input="limpiarErrorEdicion('servicio')"
                />
              </div>
              <span v-if="erroresEdicion.servicio" class="field-error">{{
                erroresEdicion.servicio
              }}</span>
            </div>

            <!-- URL -->
            <div class="form-group" :class="{ 'has-error': erroresEdicion.url }">
              <label for="edit-url">URL</label>
              <div class="input-wrapper">
                <input
                  id="edit-url"
                  type="url"
                  v-model="formEdicion.url"
                  placeholder="https://ejemplo.com"
                  @input="limpiarErrorEdicion('url')"
                />
              </div>
              <span v-if="erroresEdicion.url" class="field-error">{{ erroresEdicion.url }}</span>
            </div>

            <!-- Usuario -->
            <div class="form-group" :class="{ 'has-error': erroresEdicion.usuario }">
              <label for="edit-usuario">Usuario</label>
              <div class="input-wrapper">
                <input
                  id="edit-usuario"
                  type="text"
                  v-model="formEdicion.usuario"
                  placeholder="usuario@correo.com"
                  @input="limpiarErrorEdicion('usuario')"
                />
              </div>
              <span v-if="erroresEdicion.usuario" class="field-error">{{
                erroresEdicion.usuario
              }}</span>
            </div>

            <!-- Contraseña -->
            <div class="form-group" :class="{ 'has-error': erroresEdicion.password }">
              <label for="edit-password">Contraseña</label>
              <div class="input-wrapper">
                <input
                  id="edit-password"
                  :type="mostrarPasswordEdicion ? 'text' : 'password'"
                  v-model="formEdicion.password"
                  placeholder="••••••••"
                  @input="limpiarErrorEdicion('password')"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="toggle-pass"
                  @click="mostrarPasswordEdicion = !mostrarPasswordEdicion"
                  :title="mostrarPasswordEdicion ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  {{ mostrarPasswordEdicion ? '🙈' : '👁' }}
                </button>
              </div>
              <span v-if="erroresEdicion.password" class="field-error">{{
                erroresEdicion.password
              }}</span>
            </div>

            <!-- Notas (opcional) -->
            <div class="form-group">
              <label for="edit-notas">Notas <span class="opcional">(opcional)</span></label>
              <textarea
                id="edit-notas"
                v-model="formEdicion.notas"
                placeholder="Añadir notas adicionales..."
                rows="3"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="form-actions">
              <button type="button" class="btn-cancelar" @click="cerrarEdicion">Cancelar</button>
              <button type="submit" class="btn-guardar" :disabled="guardandoEdicion">
                <span v-if="guardandoEdicion" class="spinner"></span>
                {{ guardandoEdicion ? 'Guardando...' : '💾 Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  obtenerCredenciales,
  actualizarCredencial,
  eliminarCredencial as eliminarCredencialApi,
} from '../services/CredService'

// Lista de credenciales (cargada desde el backend)
const credenciales = ref([])
const cargando = ref(false)
const errorCarga = ref('')

const busqueda = ref('')
const credencialSeleccionada = ref(null)
const mostrandoPassword = ref(false)

// ---- Modal de edición ----
const modalEdicion = ref(false)
const credencialEditandoId = ref(null)
const mostrarPasswordEdicion = ref(false)
const guardandoEdicion = ref(false)
const errorEdicion = ref('')

const formEdicion = reactive({
  servicio: '',
  url: '',
  usuario: '',
  password: '',
  notas: '',
})

const erroresEdicion = reactive({
  servicio: '',
  url: '',
  usuario: '',
  password: '',
})

// Cargar credenciales del backend al montar
onMounted(() => {
  cargarCredenciales()
})

async function cargarCredenciales() {
  cargando.value = true
  errorCarga.value = ''

  try {
    const data = await obtenerCredenciales()
    credenciales.value = data
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      errorCarga.value = err.response.data.message
    } else {
      errorCarga.value = 'Error al cargar las credenciales'
    }
  } finally {
    cargando.value = false
  }
}

// Filtrar credenciales por nombre de servicio
const credencialesFiltradas = computed(() => {
  if (!busqueda.value.trim()) return credenciales.value
  const termino = busqueda.value.toLowerCase()
  return credenciales.value.filter((c) => c.servicio.toLowerCase().includes(termino))
})

// Formatear fecha
function formatearFecha(fechaStr) {
  if (!fechaStr) return '—'
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ---- Acciones de detalle ----
function verDetalle(cred) {
  mostrandoPassword.value = false
  credencialSeleccionada.value = cred
}

function togglePassword() {
  mostrandoPassword.value = !mostrandoPassword.value
}

function cerrarModal() {
  credencialSeleccionada.value = null
  mostrandoPassword.value = false
}

// ---- Acciones de edición ----
function editarCredencial(cred) {
  credencialEditandoId.value = cred.id
  formEdicion.servicio = cred.servicio
  formEdicion.url = cred.url || ''
  formEdicion.usuario = cred.usuario
  formEdicion.password = cred.password
  formEdicion.notas = cred.notas || ''
  mostrarPasswordEdicion.value = false
  errorEdicion.value = ''

  // Limpiar errores
  erroresEdicion.servicio = ''
  erroresEdicion.url = ''
  erroresEdicion.usuario = ''
  erroresEdicion.password = ''

  modalEdicion.value = true
}

function limpiarErrorEdicion(campo) {
  erroresEdicion[campo] = ''
  errorEdicion.value = ''
}

function validarEdicion() {
  let valido = true

  if (!formEdicion.servicio.trim()) {
    erroresEdicion.servicio = 'El nombre de servicio es obligatorio'
    valido = false
  }

  if (!formEdicion.url.trim()) {
    erroresEdicion.url = 'La URL es obligatoria'
    valido = false
  }

  if (!formEdicion.usuario.trim()) {
    erroresEdicion.usuario = 'El usuario es obligatorio'
    valido = false
  }

  if (!formEdicion.password) {
    erroresEdicion.password = 'La contraseña es obligatoria'
    valido = false
  }

  return valido
}

async function guardarEdicion() {
  if (!validarEdicion()) return

  guardandoEdicion.value = true
  errorEdicion.value = ''

  try {
    const datosActualizados = {
      servicio: formEdicion.servicio.trim(),
      url: formEdicion.url.trim(),
      usuario: formEdicion.usuario.trim(),
      password: formEdicion.password,
      notas: formEdicion.notas.trim(),
    }

    await actualizarCredencial(credencialEditandoId.value, datosActualizados)

    // Actualizar la lista local con los datos editados
    const idx = credenciales.value.findIndex((c) => c.id === credencialEditandoId.value)
    if (idx !== -1) {
      Object.assign(credenciales.value[idx], datosActualizados)
      credenciales.value[idx].ultimaActualizacion = new Date().toISOString()
    }

    cerrarEdicion()
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      errorEdicion.value = err.response.data.message
    } else {
      errorEdicion.value = 'Error al actualizar la credencial'
    }
  } finally {
    guardandoEdicion.value = false
  }
}

function cerrarEdicion() {
  modalEdicion.value = false
  credencialEditandoId.value = null
  mostrarPasswordEdicion.value = false
  errorEdicion.value = ''
}

// ---- Eliminar ----
async function confirmarEliminar(cred) {
  if (!confirm(`¿Eliminar la credencial de ${cred.servicio}?`)) return

  try {
    await eliminarCredencialApi(cred.id)
    credenciales.value = credenciales.value.filter((c) => c.id !== cred.id)
  } catch (err) {
    alert('Error al eliminar la credencial')
  }
}
</script>

<style scoped>
/* ---- Página ---- */
.credenciales-page {
  min-height: calc(100vh - 60px);
  background: #1e1e1e;
  padding: 28px 32px;
  color: #e2e8f0;
}

/* ---- Toolbar ---- */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box input {
  padding: 10px 14px;
  width: 320px;
  max-width: 100%;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input::placeholder {
  color: #666;
}

.search-box input:focus {
  border-color: #3b82f6;
}

.btn-nueva {
  padding: 10px 18px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-nueva:hover {
  background: #2563eb;
}

/* ---- Estado de carga ---- */
.cargando {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 15px;
}

/* ---- Error ---- */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
}

.error-inline {
  margin-bottom: 16px;
}

.error-icon {
  font-size: 15px;
}

.btn-reintentar {
  margin-left: auto;
  padding: 6px 14px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-reintentar:hover {
  background: rgba(59, 130, 246, 0.3);
}

/* ---- Tabla ---- */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
}

thead th {
  text-align: left;
  padding: 12px 16px;
  background: #333;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #444;
}

tbody tr {
  border-bottom: 1px solid #333;
  transition: background 0.15s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #333;
}

tbody td {
  padding: 12px 16px;
  font-size: 14px;
  vertical-align: middle;
}

.col-servicio {
  font-weight: 600;
  color: #fff;
}

.link-url {
  color: #60a5fa;
  text-decoration: none;
  font-size: 13px;
}

.link-url:hover {
  text-decoration: underline;
}

.text-muted {
  color: #555;
}

/* ---- Botones de acción ---- */
.col-acciones {
  white-space: nowrap;
  display: flex;
  gap: 6px;
}

.btn-accion {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
  font-weight: 500;
}

.btn-accion:hover {
  transform: translateY(-1px);
}

.btn-ver {
  background: #334155;
  color: #94a3b8;
}

.btn-ver:hover {
  background: #475569;
  color: #e2e8f0;
}

.btn-editar {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.btn-editar:hover {
  background: rgba(59, 130, 246, 0.3);
}

.btn-eliminar {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.btn-eliminar:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* ---- Sin resultados ---- */
.sin-resultados {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 15px;
}

/* ---- Modal (compartido detalle y edición) ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  width: 100%;
  max-width: 480px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

.modal-edicion {
  max-width: 520px;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #3a3a3a;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.btn-cerrar {
  background: none;
  border: none;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.btn-cerrar:hover {
  background: #333;
  color: #fff;
}

.modal-body {
  padding: 20px;
}

/* ---- Detalle ---- */
.detalle-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.detalle-row:last-child {
  border-bottom: none;
}

.detalle-label {
  font-size: 13px;
  color: #94a3b8;
  min-width: 140px;
  flex-shrink: 0;
  font-weight: 500;
}

.detalle-notas {
  color: #cbd5e1;
  font-size: 14px;
  white-space: pre-wrap;
  line-height: 1.5;
}

.contrasena-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contrasena-field code {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e2e8f0;
  background: #333;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-toggle-pass {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-toggle-pass:hover {
  background: rgba(59, 130, 246, 0.3);
}

/* ---- Formulario de edición ---- */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #a0aec0;
}

.opcional {
  color: #666;
  font-weight: 400;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 11px 14px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input-wrapper input::placeholder {
  color: #666;
}

.input-wrapper input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.has-error .input-wrapper input {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

textarea {
  width: 100%;
  padding: 11px 14px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  min-height: 70px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

textarea::placeholder {
  color: #666;
}

textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.field-error {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #f87171;
}

.toggle-pass {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle-pass:hover {
  opacity: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancelar {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #555;
  color: #a0aec0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;
}

.btn-cancelar:hover {
  color: #e2e8f0;
  border-color: #777;
  background: #333;
}

.btn-guardar {
  padding: 10px 22px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition:
    background 0.2s,
    transform 0.15s;
}

.btn-guardar:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-guardar:active:not(:disabled) {
  transform: translateY(0);
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ---- Spinner ---- */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
