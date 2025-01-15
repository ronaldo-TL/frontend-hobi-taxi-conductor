<template>
  <q-form
    class="row q-col-gutter-md"
    @submit="$emit('guardar')"
  >
    <q-input
      filled
      class="col-xs-12 col-md-6 required"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-6 required"
      label="Ruta"
      v-model="valoresModel.ruta"
      :rules="valoresRules.ruta"
    />
    <q-select
      filled
      use-input
      class="col-xs-12 col-md-6 required"
      label="Icono"
      :options="IconList"
      v-model="valoresModel.icono"
      :rules="valoresRules.icono"
      @filter="filtrarOpciones"
    >
      <template v-slot:append>
        <q-icon
          size="md"
          color="secondary"
          :name="valoresModel.icono"
          class="q-ml-md"
        />
      </template>

      <template v-slot:option="props">
        <q-item
          v-bind="props.itemProps"
          v-on="props.itemEvents"
        >
          <q-item-section avatar>
            <q-icon :name="props.opt" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="props.opt" />
            <q-item-label caption>{{ props.opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      filled
      class="col-xs-12 col-md-6 required"
      label="orden"
      v-model="valoresModel.orden"
      :rules="valoresRules.orden"
    />
    <div class="col-xs-12 text-right">
      <q-btn
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        flat
        color="negative"
        @click="$emit('cancelar')"
      />
      <q-btn
        class="q-ml-sm"
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
        rounded
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { ref, onMounted } from 'vue'
import validaciones from '../../common/validations'
import IconListOriginal from '../../common/IconList'

const valoresRules = {
  nombre: [
    validaciones.requerido
  ],
  ruta: [
    validaciones.requerido
  ],
  icono: [
    validaciones.requerido
  ],
  orden: [
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
    const IconList = ref(IconListOriginal)

    onMounted(async () => {
    })

    const filtrarOpciones = (val, update) => {
      if (val === '') {
        update(() => {
          IconList.value = IconListOriginal
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        IconList.value = IconListOriginal.filter(v => v.toLowerCase().includes(needle))
      })
    }

    return {
      IconList,
      IconListOriginal,
      valoresModel,
      valoresRules,
      filtrarOpciones
    }
  }
}
</script>
