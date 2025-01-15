<template>
  <q-layout view="lHh lpR lff">
    <!-- <q-header :class="{ 'bg-white': ! $q.dark.isActive, 'q-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-space />
        <q-space />
        <q-toggle name="dark" v-model="darkMode" icon="dark_mode" @click="darkModeChange" />
        <div v-if="isDevelopment" class="baner-development">{{tituloAmbiente}}</div>
      </q-toolbar>
    </q-header> -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { useQuasar } from 'quasar'
// import { ref } from 'vue'
import { constants } from '../../src/constants/app'

export default {

  setup () {
    // const $q = useQuasar()
    // const darkMode = ref($q.dark.isActive)
    const isDevelopment = ['development', 'local'].includes(process.env.AMBIENTE)
    const tituloAmbiente = constants.AMBIENTES[process.env.AMBIENTE] || null
    return {
      // darkMode,
      // darkModeChange () {
      //   $q.dark.set(!$q.dark.isActive)
      // },
      isDevelopment,
      tituloAmbiente
    }
  }
}
</script>
