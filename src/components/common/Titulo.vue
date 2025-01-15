<template>
  <div class="row justify-center items-center">
    <div class="col-xs-12 col-md-12">
        <div class="text-h5 text-primary text-bold">{{titulo}}</div>
        <div v-if="fecha" class="text-subtitle1 q-mb-lg text-grey-6"><span class="text-secondary text-bold ">{{diaActual}}, </span>{{fechaActual}}</div>
    </div>
    <div class="col-xs-12 q-pb-md" v-if="mensaje && alerta">
        <div class="alert alert--warning">
          <q-icon name="error_outline" size="md" class="q-pr-sm" /> {{mensaje}}
        </div>
      </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { date } from 'quasar'
import { useGlobalStore } from 'src/stores/app'

export default {
  name: 'Titulo',
  props: {
    titulo: {
      type: String,
      default: () => ''
    },
    icono: {
      type: String,
      default: () => ''
    },
    fecha: {
      type: Boolean,
      default: true
    },
    alerta: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const store = useGlobalStore()
    const fechaActual = computed(() => date.formatDate(store.fechaActual, 'DD MMM YYYY'))
    const diaActual = computed(() => date.formatDate(store.fechaActual, 'dddd'))
    const mensaje = computed(() => store.alerta)

    return {
      fechaActual,
      diaActual,
      mensaje
    }
  }
}
</script>
<style lang="scss">
.auxiliar {
  height: 135px !important;
  margin-bottom: -130px;
}

.titulo-global {
  padding-top: 15px;
}
</style>
