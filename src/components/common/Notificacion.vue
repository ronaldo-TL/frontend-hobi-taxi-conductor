<template>
    <q-item clickable v-ripple>
        <q-item-section>
            <q-btn
              dense
              round
              icon="notifications"
              flat
              color="primary"
            >
                <q-badge  color="red" floating v-if="cantidad>0">{{ cantidad }}</q-badge>
            </q-btn>
        </q-item-section>
        <q-menu
          anchor="bottom right"
          self="top right"
          class="dialog"
          @show="getNotificaciones"
        >
            <q-card style="width: 400px">
                <q-toolbar class="bg-grey-2">
                    <div class="text-subtitle1 text-bold text-grey-8">Notificaciones</div>
                </q-toolbar>
                <q-card-section v-if="loading" style="max-height: 500vh">
                    <q-item style="max-width: 300px" v-for="(item,index) in 3" :key="index">
                        <q-item-section avatar>
                            <q-skeleton type="QAvatar" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>
                            <q-skeleton type="text" />
                            </q-item-label>
                            <q-item-label caption>
                            <q-skeleton type="text" width="65%" />
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card-section>
                <q-card-section v-else class="scrollable-content q-pa-none">
                    <q-list v-if="notificaciones.length>0">
                        <q-item v-for="notificacion in notificaciones" :key="notificacion.id" :class="{'bg-blue-1':notificacion.read_at===null}" class="q-pt-none">
                            <q-item-section>
                                <div class="text-bold q-pt-md flex">
                                    <div>{{ notificacion?.data?.titulo }}</div>
                                    <q-space />

                                </div>
                                <div class="text-caption text-justify">
                                    {{ notificacion.data?.message }}
                                </div>

                            </q-item-section>
                            <q-item-section avatar>
                                <div class="text-caption text-orange-6 text-bold">{{ formatDate(notificacion.created_at,'DD/MM/YYYY H:mm') }}</div>
                                <div class="text-right" v-if="notificacion?.data?.ruta">
                                    <q-btn size="sm" flat color="primary" label="ver" @click="go(notificacion)" />
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-menu>
    </q-item>
</template>
<script>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { date } from 'quasar'
import { useRouter } from 'vue-router'

const { formatDate } = date

export default {
  setup () {
    const _http = inject('http')
    const Router = useRouter()
    const cantidad = ref(0)
    const loading = ref(false)
    const notificaciones = ref([])
    const notificacionInterval = ref(null)

    onMounted(async () => {
      await getCantidadNoLeida()
      notificacionInterval.value = setInterval(async () => {
        await getCantidadNoLeida()
      }, 30000)
    })

    onBeforeUnmount(() => {
      if (notificacionInterval.value) {
        clearInterval(notificacionInterval.value)
      }
    })

    const getCantidadNoLeida = async () => {
      cantidad.value = await _http.get('system/usuarios/notificaciones/cantidad', false)
    }

    const getNotificaciones = async () => {
      loading.value = true
      const respuesta = await _http.get('system/usuarios/notificaciones', false)
      if (respuesta) {
        notificaciones.value = respuesta
        cantidad.value = 0
        loading.value = false
      }
    }

    const go = async (notificacion) => {
      Router.push(notificacion?.data?.ruta)
    }

    return {
      cantidad,
      loading,
      notificaciones,
      getNotificaciones,
      formatDate,
      go
    }
  }
}
</script>
<style>
.scrollable-content {
  max-height: 55vh;
  overflow-y: auto;
}
</style>
