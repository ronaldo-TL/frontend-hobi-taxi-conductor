import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    usuario: {},
    rol: {},
    restaurante: {},
    menu: [],
    permisos: [],
    fechaActual: null,
    alerta: null
  }),
  actions: {
    setRol (rol) {
      this.rol = rol
    },
    setUsuario (usuario) {
      this.usuario = usuario
    },
    setRestaurante (restaurante) {
      this.restaurante = restaurante
    },
    setMenu (menu) {
      this.menu = menu
    },
    setPermisos (permisos) {
      this.permisos = permisos
    },
    setFechaActual (fecha) {
      this.fechaActual = fecha
    }
  }
})
