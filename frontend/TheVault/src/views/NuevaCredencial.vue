<template>
  <div class="nueva-cred-page">
    <div class="form-card">
      <h2>➕ Nueva Credencial</h2>

      <!-- Error del servidor -->
      <div v-if="errorGeneral" class="error-banner">
        <span class="error-icon">⚠</span>
        <span>{{ errorGeneral }}</span>
      </div>

      <form @submit.prevent="guardar" novalidate>
        <!-- Nombre de servicio -->
        <div class="form-group" :class="{ 'has-error': errores.servicio }">
          <label for="servicio">Nombre de servicio</label>
          <div class="input-wrapper">
            <input
              id="servicio"
              type="text"
              v-model="form.servicio"
              placeholder="Ej: Netflix, GitHub..."
              @input="limpiarError('servicio')"
            />
          </div>
          <span v-if="errores.servicio" class="field-error">{{ errores.servicio }}</span>
        </div>

        <!-- URL -->
        <div class="form-group" :class="{ 'has-error': errores.url }">
          <label for="url">URL</label>
          <div class="input-wrapper">
            <input
              id="url"
              type="url"
              v-model="form.url"
              placeholder="https://ejemplo.com"
              @input="limpiarError('url')"
            />
          </div>
          <span v-if="errores.url" class="field-error">{{ errores.url }}</span>
        </div>

        <!-- Usuario -->
        <div class="form-group" :class="{ 'has-error': errores.usuario }">
          <label for="usuario">Usuario</label>
          <div class="input-wrapper">
            <input
              id="usuario"
              type="text"
              v-model="form.usuario"
              placeholder="usuario@correo.com"
              @input="limpiarError('usuario')"
            />
          </div>
          <span v-if="errores.usuario" class="field-error">{{ errores.usuario }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-group" :class="{ 'has-error': errores.password }">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <input
              id="password"
              :type="mostrarPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="••••••••"
              @input="limpiarError('password')"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle-pass"
              @click="mostrarPassword = !mostrarPassword"
              :title="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              {{ mostrarPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errores.password" class="field-error">{{ errores.password }}</span>
        </div>

        <!-- Notas (opcional) -->
        <div class="form-group">
          <label for="notas">Notas <span class="opcional">(opcional)</span></label>
          <textarea
            id="notas"
            v-model="form.notas"
            placeholder="Añadir notas adicionales..."
            rows="3"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
          <button type="submit" class="btn-guardar" :disabled="guardando">
            <span v-if="guardando" class="spinner"></span>
            {{ guardando ? 'Guardando...' : '💾 Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { crearCredencial } from '../services/CredService'

const router = useRouter()
const mostrarPassword = ref(false)
const guardando = ref(false)
const errorGeneral = ref('')

// Formulario
const form = reactive({
  servicio: '',
  url: '',
  usuario: '',
  password: '',
  notas: '',
})

// Errores por campo
const errores = reactive({
  servicio: '',
  url: '',
  usuario: '',
  password: '',
})

// Limpiar error al escribir
function limpiarError(campo) {
  errores[campo] = ''
  errorGeneral.value = ''
}

// Validar formulario
function validarFormulario() {
  let valido = true

  if (!form.servicio.trim()) {
    errores.servicio = 'El nombre de servicio es obligatorio'
    valido = false
  }

  if (!form.url.trim()) {
    errores.url = 'La URL es obligatoria'
    valido = false
  }

  if (!form.usuario.trim()) {
    errores.usuario = 'El usuario es obligatorio'
    valido = false
  }

  if (!form.password) {
    errores.password = 'La contraseña es obligatoria'
    valido = false
  }

  return valido
}

// Guardar credencial vía backend
async function guardar() {
  if (!validarFormulario()) return

  guardando.value = true
  errorGeneral.value = ''

  try {
    await crearCredencial({
      servicio: form.servicio.trim(),
      url: form.url.trim(),
      usuario: form.usuario.trim(),
      password: form.password,
      notas: form.notas.trim(),
    })

    router.push('/credenciales')
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      errorGeneral.value = err.response.data.message
    } else {
      errorGeneral.value = 'Error al guardar la credencial'
    }
  } finally {
    guardando.value = false
  }
}

// Cancelar y volver
function cancelar() {
  router.push('/credenciales')
}
</script>

<style scoped>
/* ---- Página ---- */
.nueva-cred-page {
  min-height: calc(100vh - 60px);
  background: #1e1e1e;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

/* ---- Tarjeta ---- */
.form-card {
  width: 100%;
  max-width: 520px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 32px 28px;
  animation: fadeUp 0.35s ease-out;
  align-self: flex-start;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 24px;
}

/* ---- Error general ---- */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
}

.error-icon {
  font-size: 15px;
}

/* ---- Formulario ---- */
.form-group {
  margin-bottom: 18px;
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

/* ---- Toggle contraseña ---- */
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

/* ---- Botones ---- */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
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
  width: 14px;
  height: 14px;
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
