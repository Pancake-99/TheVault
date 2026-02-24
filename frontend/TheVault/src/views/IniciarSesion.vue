<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Branding -->
      <div class="brand">
        <h1>TheVault</h1>
      </div>

      <form @submit.prevent="iniciarSesion" novalidate>
        <!-- Email / Usuario -->
        <div class="form-group" :class="{ 'has-error': errores.email }">
          <label for="email">Email / Usuario</label>
          <div class="input-wrapper">
            <input
              id="email"
              type="text"
              v-model="email"
              placeholder="tu@correo.com"
              @input="limpiarError('email')"
              autocomplete="username"
            />
          </div>
          <span v-if="errores.email" class="field-error">{{ errores.email }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-group" :class="{ 'has-error': errores.contrasena }">
          <label for="contrasena">Contraseña</label>
          <div class="input-wrapper">
            <input
              id="contrasena"
              :type="mostrarContrasena ? 'text' : 'password'"
              v-model="contrasena"
              placeholder="••••••••"
              @input="limpiarError('contrasena')"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-pass"
              @click="mostrarContrasena = !mostrarContrasena"
              :title="mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              {{ mostrarContrasena ? '👁' : '👁' }}
            </button>
          </div>
          <span v-if="errores.contrasena" class="field-error">{{ errores.contrasena }}</span>
        </div>

        <!-- Error general (servidor / credenciales) -->
        <div v-if="errorGeneral" class="error-banner">
          <span class="error-icon">⚠</span>
          <span>{{ errorGeneral }}</span>
        </div>

        <!-- Botón de submit -->
        <button type="submit" class="btn-login" :disabled="cargando">
          <span v-if="cargando" class="spinner"></span>
          {{ cargando ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Link a registro -->
      <p class="link-alterno">
        ¿No tienes cuenta?
        <router-link to="/registrarse">Crear Cuenta</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/AuthService'

const router = useRouter()

// Datos del formulario
const email = ref('')
const contrasena = ref('')
const mostrarContrasena = ref(false)
const cargando = ref(false)
const errorGeneral = ref('')

// Errores por campo
const errores = reactive({
  email: '',
  contrasena: '',
})

// Limpiar error al escribir
function limpiarError(campo) {
  errores[campo] = ''
  errorGeneral.value = ''
}

// Validar campos antes de enviar
function validarFormulario() {
  let valido = true

  if (!email.value.trim()) {
    errores.email = 'El usuario o correo es obligatorio'
    valido = false
  }

  if (!contrasena.value) {
    errores.contrasena = 'La contraseña es obligatoria'
    valido = false
  }

  return valido
}

// Función de login conectada al backend
async function iniciarSesion() {
  errorGeneral.value = ''
  errores.email = ''
  errores.contrasena = ''

  if (!validarFormulario()) return

  cargando.value = true

  try {
    const data = await login(email.value.trim(), contrasena.value)

    // Guardar el token que devuelve el backend
    localStorage.setItem('token', data.token)
    router.push('/credenciales')
  } catch (err) {
    // Manejar errores del servidor
    if (err.response && err.response.status === 401) {
      errorGeneral.value = 'Usuario o contraseña incorrectos'
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
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  padding: 20px;
}

/* ---- Tarjeta ---- */
.login-card {
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
.btn-login {
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

.btn-login:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
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
</style>
