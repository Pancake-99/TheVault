<template>
  <div>
    <!-- Ocultar header en la página de login -->
    <HeaderApp v-if="!esRutaLogin" />
    <router-view />
  </div>
</template>

<script setup>
import HeaderApp from './components/HeaderApp.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Detectar si estamos en una ruta de auth (sin header)
const esRutaLogin = computed(
  () => route.path === '/iniciar-sesion' || route.path === '/registrarse',
)
</script>

<style>
/* Reset global mínimo */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
