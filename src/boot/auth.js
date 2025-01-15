import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useGlobalStore } from 'src/stores/app'

const AUTH_URL = process.env.AUTH_URL

export default boot(({ app, router, store }) => {
  const _storage = app.config.globalProperties.$storage
  const _store = useGlobalStore()
  const _message = app.config.globalProperties.$message

  const login = async (params, url = '/login') => {
    try {
      const { data } = await axios.post(`${AUTH_URL}${url}`, params)
      const respuesta = data.datos
      const usuario = {
        id: respuesta.usuario.id,
        usuario: respuesta.usuario?.usuario,
        nombreCompleto: respuesta.usuario?.nombreCompleto,
        correoElectronico: respuesta.usuario?.correoElectronico
      }
      console.log(respuesta)
      _storage.setUsuario(usuario)
      _storage.set('menu', respuesta.menu)
      _storage.set('rol', respuesta.usuario.rol)
      const restaurante = respuesta.usuario.restaurante
      _storage.set('restaurante', restaurante)
      // _storage.set('permisos', respuesta.permisos)
      _storage.set('token', respuesta.token)
      _storage.set('fecha_actual', respuesta.fechaActual)

      initStore()
      let rutaInicial = '/app/'
      if (respuesta.menu?.length > 0) {
        rutaInicial += respuesta.menu[0].ruta
      }
      router.push(rutaInicial)
    } catch (error) {
      let mensaje = 'Ocurrio un error desconocido.'
      if (error.response) {
        const { data } = error.response
        mensaje = data.mensaje
      }
      _message.error(mensaje)
    }
  }

  const logout = async () => {
    try {
      cleanStore()
    } catch (error) {
      _message.error('Ocurrio un error al intentar cerrar su sesión')
    }
  }

  const cleanStore = () => {
    _storage.removeUsuario()
    _storage.remove('rol')
    _storage.remove('restaurante')
    _storage.remove('menu')
    _storage.remove('permisos')
    _storage.remove('token')
    _store.setUsuario({})
    _store.setRol({})
    _store.setRestaurante({})
    _store.setMenu([])
    _store.setPermisos([])
    _storage.remove('login_local')
    Object.keys(localStorage).forEach((key) => {
      if (key.endsWith('_token')) {
        localStorage.removeItem(key)
      }
    })
    const urlLogin = _storage.get('url_login') || '/'
    if (urlLogin === router.currentRoute.value.fullPath) {
      router.go()
    } else {
      router.push(urlLogin)
    }
  }

  const initStore = () => {
    _store.setUsuario(_storage.getUsuario())
    _store.setRol(_storage.get('rol'))
    _store.setRestaurante(_storage.get('restaurante'))
    _store.setMenu(_storage.get('menu'))
    _store.setPermisos(_storage.get('permisos'))
    _store.setFechaActual(_storage.get('fecha_actual'))
  }

  app.config.globalProperties.$auth = {
    cleanStore,
    initStore,
    login,
    logout
  }

  app.provide('auth', {
    cleanStore,
    initStore,
    login,
    logout
  })
})

//
