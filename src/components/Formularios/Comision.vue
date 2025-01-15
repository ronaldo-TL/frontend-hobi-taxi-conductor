<template>
  <q-form
    ref="comision"
    class="row q-col-gutter-sm"
    @submit="$emit('guardar')"
  >
    <q-select
      class="col-xs-12 required"
      v-model="valoresModel.conductorId"
      :options="conductores"
      label="Conductor"
      filled
      map-options
      option-label="nombreCompleto"
      option-value="id"
      emit-value
      :rules="valoresRules.requerido"
    />
    <q-input
      filled
      class="col-xs-6 required"
      label="Fecha Inicio"
      type="date"
      stack-label
      v-model="valoresModel.fechaInicio"
      :rules="valoresRules.requerido"
    />
    <q-input
      filled
      class="col-xs-6 required"
      label="Fecha Fin"
      type="date"
      stack-label
      v-model="valoresModel.fechaFin"
      :rules="valoresRules.requerido"
    />
    <div class="col-xs-12 text-right">
      <q-btn
        flat
        rounded
        color="negative"
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        @click="$emit('cancelar')"
      />
      <q-btn
        rounded
        class="q-ml-sm"
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { onMounted, inject, ref } from 'vue'
import validaciones from '../../common/validations'

const valoresRules = {
  requerido: [
    validaciones.requerido
  ]
}

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')
    const conductores = ref([])

    onMounted(async () => {
      const { rows } = await _http.get('jobi/conductores?limit=100')
      conductores.value = rows.map(e => ({
        ...e,
        nombreCompleto: getNombreCompleto(e.usuario)
      }))
    })

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido || ''} ${usuario.segundoApellido || ''}`
    }

    return {
      valoresModel,
      valoresRules,
      conductores
    }
  }
}
</script>
