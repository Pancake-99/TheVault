<template>
  <div class="register-page">
    <div class="register-card">
      <!-- Branding -->
      <div class="brand">
        <h1>TheVault</h1>
        <p class="subtitulo">Crear una cuenta</p>
      </div>

      <form @submit.prevent="registrarse" novalidate>
        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errores.email }">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="tu@correo.com"
              @input="limpiarError('email')"
              autocomplete="email"
            />
          </div>
          <span v-if="errores.email" class="field-error">{{ errores.email }}</span>
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
              {{ mostrarPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <span v-if="errores.password" class="field-error">{{ errores.password }}</span>
        </div>

        <!-- Confirmar contraseña -->
        <div class="form-group" :class="{ 'has-error': errores.confirmarPassword }">
          <label for="confirmar-password">Confirmar contraseña</label>
          <div class="input-wrapper">
            <input
              id="confirmar-password"
              :type="mostrarConfirmar ? 'text' : 'password'"
              v-model="form.confirmarPassword"
              placeholder="••••••••"
              @input="limpiarError('confirmarPassword')"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle-pass"
              @click="mostrarConfirmar = !mostrarConfirmar"
              :title="mostrarConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              {{ mostrarConfirmar ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <span v-if="errores.confirmarPassword" class="field-error">{{
            errores.confirmarPassword
          }}</span>
        </div>

        <!-- Error general -->
        <div v-if="errorGeneral" class="error-banner">
          <span class="error-icon">!</span>
          <span>{{ errorGeneral }}</span>
        </div>

        <!-- Botón -->
        <button type="submit" class="btn-register" :disabled="cargando">
          <span v-if="cargando" class="spinner"></span>
          {{ cargando ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>

      <!-- Link a login -->
      <p class="link-alterno">
        ¿Ya tienes cuenta?
        <router-link to="/iniciar-sesion">Iniciar Sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/AuthService'

const router = useRouter()
const mostrarPassword = ref(false)
const mostrarConfirmar = ref(false)
const cargando = ref(false)
const errorGeneral = ref('')

// Formulario
const form = reactive({
  email: '',
  password: '',
  confirmarPassword: '',
})

// Errores por campo
const errores = reactive({
  email: '',
  password: '',
  confirmarPassword: '',
})

// Limpiar error al escribir
function limpiarError(campo) {
  errores[campo] = ''
  errorGeneral.value = ''
}

// Validar formulario
function validarFormulario() {
  let valido = true

  if (!form.email.trim()) {
    errores.email = 'El email es obligatorio'
    valido = false
  }

  if (!form.password) {
    errores.password = 'La contraseña es obligatoria'
    valido = false
  } else if (form.password.length < 6) {
    errores.password = 'Mínimo 6 caracteres'
    valido = false
  }

  if (!form.confirmarPassword) {
    errores.confirmarPassword = 'Debes confirmar la contraseña'
    valido = false
  } else if (form.password !== form.confirmarPassword) {
    errores.confirmarPassword = 'Las contraseñas no coinciden'
    valido = false
  }

  return valido
}

// Registrar usuario
async function registrarse() {
  errorGeneral.value = ''
  Object.keys(errores).forEach((k) => (errores[k] = ''))

  if (!validarFormulario()) return

  cargando.value = true

  try {
    await register({
      email: form.email.trim(),
      password: form.password,
    })

    // Registro exitoso → redirigir al login
    router.push('/iniciar-sesion')
  } catch (err) {
    if (err.response && err.response.status === 409) {
      errorGeneral.value = 'Ya existe una cuenta con ese email'
    } else if (err.response && err.response.data && err.response.data.message) {
      errorGeneral.value = err.response.data.message
    } else {
      errorGeneral.value = 'Error de conexión con el servidor'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* ---- Página completa ---- */
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  padding: 20px;
}

/* ---- Tarjeta ---- */
.register-card {
  width: 100%;
  max-width: 420px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 40px 32px 32px;
  animation: fadeUp 0.4s ease-out;
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

/* ---- Marca ---- */
.brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand h1 {
  font-size: 26px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 1px;
}

.subtitulo {
  margin-top: 6px;
  font-size: 14px;
  color: #94a3b8;
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
  color: #e2e8f0;
}

.toggle-pass:hover {
  opacity: 1;
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
  animation: shake 0.35s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-icon {
  font-size: 15px;
}

/* ---- Botón ---- */
.btn-register {
  width: 100%;
  padding: 12px;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.2s,
    transform 0.15s;
}

.btn-register:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ---- Link alterno ---- */
.link-alterno {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #94a3b8;
}

.link-alterno a {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
}

.link-alterno a:hover {
  text-decoration: underline;
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
