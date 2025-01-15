<template>
  <section>
    <q-chip
      square
      :color="color"
      text-color="white"
      :label="estado"
    />
  </section>
</template>
<script>
import { computed } from 'vue'

const coloresEstado = {
  ACTIVO: 'info',
  INACTIVO: 'warning',
  NUEVO: 'grey',
  ACEPTADO: 'positive',
  RECHAZADO: 'negative',
  COMPLETADO: 'positive'
}
export default {
  props: {
    estado: {
      type: String,
      default: () => 'ACTIVO'
    }
  },
  setup (props) {
    const color = computed(() => {
      return coloresEstado[props.estado] || 'grey'
    })

    return {
      color
    }
  }
}
</script>
