<template>
  <q-page class="login">
    <div class="row q-col-gutter-xl justify-center items-center" style="height:100vh">
      <div class="col-md-6 bg-primary position-relative d-flex align-center justify-center" style="height:100vh; overflow:hidden;">
        <video autoplay loop muted id="video-background" style="height:100%; width:auto; object-fit:cover;">
          <source src="img/video_login.mp4" type="video/mp4">
          Tu navegador no soporta el elemento de video.
        </video>
        <div class="overlay"></div>
        <div class="logo">
          <q-img
            src="img/logo_jobi_white.png"
            style="max-width:150px"
          />
        </div>
      </div>
       <div class="col-xs-12 col-md-6 text-center">
        <div class="row justify-center items-center">
          <q-card style="width: 400px; max-width: 90vw;" flat class="q-py-lg">
          <q-toolbar class="q-pt-sm">
            <q-toolbar-title class="text-subtitle1 text-bold">
              <!-- <img src="img/logo_jobi_white.png" width="60%"/><br/> -->
              <div class="text-primary q-mt-sm"> Inicia sesión para continuar</div>
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section class="q-mx-lg">
            <q-form @submit="login">
              <q-input
                filled
                v-model="formulario.usuario"
                label="Introduce tu usuario"
                lazy-rules
                square
                class="q-mb-md"
                autofocus
                :rules="rulesLogin.usuario"
              >
                <template v-slot:append>
                  <q-icon
                    class="material-symbols-outlined"
                    name="alternate_email"
                  />
                </template>
              </q-input>
              <q-input
                filled
                v-model="formulario.contrasena"
                label="Introduce tu contraseña"
                lazy-rules
                square
                :type="isPwd ? 'password' : 'text'"
                :rules="rulesLogin.contrasena"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer material-symbols-outlined"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-btn
                color="primary"
                type="submit"
                size="16px"
                padding="10px"
                no-caps
                class="full-width q-ma-md"
                label="Iniciar sesión"
                :loading="loading"
                rounded
              />
            </q-form>
          </q-card-section>
          <q-card-actions vertical align="center">
            <p class="text-primary">¿No puedes iniciar sesión?</p>
          </q-card-actions>
          <q-card-actions
            class="q-pt-none"
            align="center"
          >
            <span class="small">Desarrollado por<strong> Juan Llusco</strong> 😈 {{ gestion }}</span>
          </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import validaciones from '../common/validations'

const rulesLogin = {
  usuario: [
    validaciones.requerido
  ],
  contrasena: [
    validaciones.requerido,
    validaciones.contrasena
  ]
}

export default {
  name: 'LoginPage',
  setup () {
    const isPwd = ref(true)
    const _auth = inject('auth')
    const gestion = ref(2024)
    const formulario = reactive({
      usuario: '',
      contrasena: ''
    })
    const loading = ref(false)

    const login = async () => {
      loading.value = true
      const respuesta = await _auth.login({ usuario: formulario.usuario, contrasena: formulario.contrasena })
      if (!respuesta) {
        loading.value = false
      }
    }

    const loginCiudadania = async () => {
      await _auth.loginCiudadania()
    }

    return {
      login,
      loginCiudadania,
      isPwd,
      formulario,
      rulesLogin,
      gestion,
      loading
    }
  }
}
</script>
<style>
.position-relative {
  position: relative;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

#video-background {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain; /* Mantiene las proporciones del video */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-47deg,#1d1d1b 0%,#1d1d1b 100%);
  z-index: 1; /* Asegura que la capa esté sobre el video */
  opacity: .8;
}

.logo{
  position: absolute;
  top: 100px;
  left: 100px;
  width: 100%;
  height: 100%;
  z-index: 999999;
}
</style>
