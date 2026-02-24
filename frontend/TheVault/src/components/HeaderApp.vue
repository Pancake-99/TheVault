<template>
  <header class="header-app">
    <div class="logo">
      <h2>TheVault</h2>
    </div>

    <nav>
      <ul>
        <li>
          <router-link to="/credenciales">Inicio</router-link>
        </li>
        <li>
          <button @click="cerrarSesion">Cerrar sesión</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function cerrarSesion() {
  localStorage.removeItem('token')
  router.push('/iniciar-sesion')
}
</script>

<style scoped>
.header-app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  padding: 0 24px;
  height: 56px;
}

.logo h2 {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: 0.5px;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

nav a {
  color: #a0aec0;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  transition:
    color 0.15s,
    background 0.15s;
}

nav a:hover {
  color: #e2e8f0;
  background: #333;
}

nav a.router-link-active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

button {
  background: transparent;
  border: 1px solid #555;
  color: #a0aec0;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;
}

button:hover {
  color: #f87171;
  border-color: #f87171;
  background: rgba(239, 68, 68, 0.08);
}
</style>
