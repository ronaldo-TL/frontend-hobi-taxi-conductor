<template>
  <q-form
    ref="parametro"
    class="row q-col-gutter-sm"
    @submit="$emit('guardar')"
  >
    <q-input
      filled
      class="col-xs-12 col-md-12 required"
      label="Grupo"
      v-model="valoresModel.grupo"
      :rules="valoresRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-12 required"
      label="Codigo"
      v-model="valoresModel.codigo"
      :rules="valoresRules.nombre"
    ></q-input>
    <q-input
      filled
      class="col-xs-12 col-md-12 required"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-12 required"
      label="Descripcion"
      v-model="valoresModel.descripcion"
      :rules="valoresRules.descripcion"
      type="textarea"
      rows="1"
      autogrow
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
import { onMounted } from 'vue'
import validaciones from '../../common/validations'

const valoresRules = {
  nombre: [
    validaciones.requerido
  ],
  descripcion: [
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
    // const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')

    onMounted(async () => {
    })

    return {
      valoresModel,
      valoresRules
    }
  }
}
</script>
