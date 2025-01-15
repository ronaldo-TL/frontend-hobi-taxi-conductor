import axios from 'axios'
import { Loading } from 'quasar'
import { boot } from 'quasar/wrappers'

const urlBase = process.env.API_URL
const codeErrorsLogout = [401, 500]
const messages = {
  'jwt expired': 'La sesión caducó, ingrese otra vez al sistema'
}

export default boot(({ app, router, store }) => {
  const Storage = app.config.globalProperties.$storage
  const Message = app.config.globalProperties.$message
  const Auth = app.config.globalProperties.$auth
  const codeLogout = [401, 403, 500]

  axios.interceptors.response.use(async (response) => {
    if (codeLogout.includes(response.status)) {
      await Auth.logout()
    }
    return response
  })
  const _http = (method, url, data, loading = true, headers) => {
    return new Promise((resolve, reject) => {
      if (loading) {
        Loading.show({
          message: 'Cargando...'
        })
      }
      url = urlBase + url
      const config = {
        method,
        url,
        data,
        headers: {}
      }

      if (headers?.Authorization) {
        config.headers.Authorization = headers?.Authorization
      } else {
        if (Storage.exist('token')) {
          config.headers.Authorization = `Bearer ${Storage.get('token')}`
        }
      }

      axios(config)
        .then(response => {
          resolve(response.data?.datos)
        })
        .catch(async error => {
          if (error.response) {
            let mensaje = 'Ocurrio un error desconocido.'
            if (error.response.status === 403) {
              return router.push('/403')
            }
            if (error.response.status === 401) {
              mensaje = 'Su sesion caduco, por favor ingrese nuevamente'
            }
            Message.error(messages[error.response.data?.mensaje] || error.response.data?.mensaje || mensaje)
            if (codeErrorsLogout.includes(error.response.status)) {
              await Auth.logout()
            }
          } else {
            Message.error(error.message || 'Ocurrio un error desconocido.')
          }
          reject(error.response?.data)
        })
        .finally(() => {
          if (loading) {
            Loading.hide()
          }
        })
    })
  }

  const http = {
    get (url, loading = true, headers) {
      return _http('get', url, null, loading, headers)
    },

    post (url, data, loading = true, headers) {
      return _http('post', url, data, loading, headers)
    },

    put (url, data, loading = true, headers) {
      return _http('put', url, data, loading, headers)
    },

    patch (url, data, loading = true, headers) {
      return _http('patch', url, data, loading, headers)
    },

    delete (url, loading = true, headers) {
      return _http('delete', url, loading, headers)
    },
    convertQuery (url, query) {
      let string = []
      for (const i in query) {
        if (query[i]) {
          string.push(i + '=' + query[i])
        }
      }
      string = string.join('&')
      if (url.includes('?')) {
        query = query ? '&' + string : ''
      } else {
        query = query ? '?' + string : ''
      }
      return url + query
    },
    getFile (url, loading = true, headers = {}) {
      return new Promise((resolve, reject) => {
        if (loading) {
          Loading.show({
            message: 'Cargando...'
          })
        }
        url = urlBase + url
        const config = {
          method: 'get',
          url,
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
        if (headers?.Authorization) {
          config.headers.Authorization = headers?.Authorization
        } else {
          if (Storage.exist('token')) {
            config.headers.Authorization = `Bearer ${Storage.get('token')}`
          }
        }
        return axios(config).then(resp => {
          try {
            if (resp.data) {
              if (!resp.data.byteLength) return resolve(null)
              const file = new window.Blob([resp.data], { type: resp.headers['content-type'] || 'application/octect-stream' })
              const fileURL = window.URL.createObjectURL(file)
              if (headers?.blob) return resolve(file)
              return resolve(fileURL)
            }
            return null
          } catch (error) {
            Message.error(error.message)
            resolve(null)
          }
        }).catch(err => {
          const json = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(err.response.data)))
          Message.error(json.mensaje)
          resolve(null)
        }).finally(() => {
          if (loading) {
            Loading.hide()
          }
        })
      })
    }
  }

  app.config.globalProperties.$http = http
  app.config.globalProperties.$axios = axios
  app.provide('http', http)
  app.provide('axios', axios)
})
