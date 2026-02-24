import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import IniciarSesion from '../views/IniciarSesion.vue'
import Registrarse from '../views/Registrarse.vue'
import Credenciales from '../views/Credenciales.vue'
import NuevaCredencial from '../views/NuevaCredencial.vue'

const routes = [
  {
    path: '/',
    redirect: '/iniciar-sesion',
  },
  {
    path: '/iniciar-sesion',
    name: 'IniciarSesion',
    component: IniciarSesion,
  },
  {
    path: '/registrarse',
    name: 'Registrarse',
    component: Registrarse,
  },
  {
    path: '/credenciales',
    name: 'Credenciales',
    component: Credenciales,
  },
  {
    path: '/credenciales/nueva',
    name: 'NuevaCredencial',
    component: NuevaCredencial,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
