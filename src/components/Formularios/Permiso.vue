<template>
  <q-form
    class="row q-col-gutter-md"
    @submit="$emit('guardar')"
  >
    <q-select
      class="col-xs-6 col-md-6"
      v-model="valoresModel.tipo"
      :options="['SISTEMA', 'INTEROPERABILIDAD']"
      label="Tipo"
      filled
      :rules="valoresRules.requerido"
    />
    <q-input
      filled
      class="col-xs-6 col-md-6"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.requerido"
    />
    <q-input
      filled
      class="col-xs-12 col-md-12"
      label="Descripcion"
      v-model="valoresModel.descripcion"
      :rules="valoresRules.requerido"
    />
    <div class="col-xs-12 text-right">
      <q-btn
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        @click="$emit('cancelar')"
      />
      <q-btn
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
    const valoresModel = useVModel(props, 'valores')

    return {
      valoresModel,
      valoresRules
    }
  }
}
</script>
